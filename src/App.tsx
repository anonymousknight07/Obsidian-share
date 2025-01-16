import React, { useState, useEffect } from 'react';
import { Book, Upload, Share2, Copy, Check, Twitter, Linkedin, Facebook, Link2 } from 'lucide-react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-'
});

function App() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (markdownContent) {
      const html = marked(markdownContent);
      setHtmlContent(html);
      
      const encodedContent = btoa(encodeURIComponent(markdownContent));
      const currentUrl = window.location.origin;
      setShareableLink(`${currentUrl}?content=${encodedContent}`);
    }
  }, [markdownContent]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const content = urlParams.get('content');
    if (content) {
      try {
        const decodedContent = decodeURIComponent(atob(content));
        setMarkdownContent(decodedContent);
      } catch (error) {
        console.error('Failed to decode content:', error);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdownContent(content);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = "Check out this markdown document!";
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareableLink);

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9d4edd] to-[#7b2cbf]">
      <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
  <div className="flex justify-center mb-4">
    <img 
      src="./public/logo.png" 
      alt="Book icon" 
      className="h-12 w-12"
    />
  </div>
  <h1 className="text-4xl font-bold text-white mb-4">
    Obsidian Share
  </h1>
  <p className="text-lg text-white/90">
    Upload your Obsidian file and just share the link for others to view it
  </p>
</div>


        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload File</h2>
            <Upload className="h-5 w-5 text-[#7b2cbf]" />
          </div>
          <label className="block w-full">
            <input
              type="file"
              accept=".md"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#9d4edd]/10 file:text-[#7b2cbf]
                hover:file:bg-[#9d4edd]/20
                cursor-pointer"
            />
          </label>
        </div>

        {shareableLink && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Share</h2>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="text-[#7b2cbf] hover:text-[#9d4edd]"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            {showShareMenu && (
              <div className="mb-4 flex gap-4 justify-center">
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90"
                  title="Share on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="p-2 rounded-full bg-[#0A66C2] text-white hover:bg-opacity-90"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90"
                  title="Share on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="p-2 rounded-full bg-[#25D366] text-white hover:bg-opacity-90"
                  title="Share on WhatsApp"
                >
                  <Link2 className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white/50 rounded-md text-sm text-gray-800"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {htmlContent && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preview</h2>
            <div 
              className="prose prose-lg prose-purple max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-white/80">
          <p>
            Upload your Obsidian files to preview and share them with others.
            The shared link will preserve all formatting and code highlighting.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;