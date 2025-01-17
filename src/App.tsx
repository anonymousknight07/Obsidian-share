import React, { useState, useEffect } from 'react';
import { Book, Upload, Share2, Copy, Check, Twitter, Linkedin, Facebook, Link2, Download, Lock, Unlock, Trash2 } from 'lucide-react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import html2pdf from 'html2pdf.js';
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
  const [shortLink, setShortLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [shortLinkError, setShortLinkError] = useState(false);

  useEffect(() => {
    if (markdownContent) {
      const html = marked(markdownContent);
      setHtmlContent(html);
      
      let encodedContent = btoa(encodeURIComponent(markdownContent));
      if (isPasswordProtected && password) {
        encodedContent = `${encodedContent}.${btoa(password)}`;
      }
      const currentUrl = window.location.origin;
      const fullUrl = `${currentUrl}?content=${encodedContent}`;
      setShareableLink(fullUrl);
      
      setShortLink('');
      setShortLinkError(false);
      setIsShortening(false);
    }
  }, [markdownContent, isPasswordProtected, password]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const content = urlParams.get('content');
    if (content) {
      try {
        const [encodedContent, encodedPassword] = content.split('.');
        if (encodedPassword) {
          const userPassword = prompt('This content is password protected. Please enter the password:');
          if (userPassword === atob(encodedPassword)) {
            const decodedContent = decodeURIComponent(atob(encodedContent));
            setMarkdownContent(decodedContent);
            setIsPasswordValid(true);
          } else {
            setIsPasswordValid(false);
            return;
          }
        } else {
          const decodedContent = decodeURIComponent(atob(encodedContent));
          setMarkdownContent(decodedContent);
        }
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

  const deleteUrl = () => {
    setShareableLink('');
    setShortLink('');
    setIsPasswordProtected(false);
    setPassword('');
    setShowShareMenu(false);
    setShowDownloadMenu(false);
    setCopied(false);
    setMarkdownContent('');
    setHtmlContent('');
  };

  const shortenUrl = async (url: string) => {
    if (isShortening) return;
    
    setIsShortening(true);
    setShortLinkError(false);
    
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
        { 
          method: 'GET',
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const shortUrl = await response.text();
      if (shortUrl) {
        const cleanShortUrl = shortUrl.replace(/^https?:\/\//, '');
        setShortLink(cleanShortUrl);
      } else {
        throw new Error('Invalid response from shortening service');
      }
    } catch (error) {
      setShortLinkError(true);
    } finally {
      setIsShortening(false);
    }
  };

  const handleShortenUrl = () => {
    if (!shortLink && !isShortening && !shortLinkError) {
      shortenUrl(shareableLink);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = "Check out this markdown document!";
    const encodedText = encodeURIComponent(text);
    const urlToShare = shortLink ? `https://${shortLink}` : shareableLink;
    const encodedUrl = encodeURIComponent(urlToShare);

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

  const downloadAsPDF = async () => {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.className = 'prose prose-lg prose-purple max-w-none p-8';
    document.body.appendChild(element);

    const opt = {
      margin: 1,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      document.body.removeChild(element);
    }
  };

  const downloadAsHTML = () => {
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; }
            pre { background: #f6f8fa; padding: 1em; border-radius: 4px; }
            code { font-family: monospace; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9d4edd] to-[#7b2cbf]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img 
              src="./logo.png" 
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

        {!isPasswordValid && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Invalid password!</strong>
            <span className="block sm:inline"> Please check the password and try again.</span>
          </div>
        )}

        {shareableLink && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Share</h2>
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="text-[#7b2cbf] hover:text-[#9d4edd] mt-2"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Download</h2>
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className="text-[#7b2cbf] hover:text-[#9d4edd] mt-2"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={deleteUrl}
                className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Delete URL"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isPasswordProtected 
                      ? 'bg-[#7b2cbf] text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {isPasswordProtected ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Password Protected
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      Add Password Protection
                    </>
                  )}
                </button>
              </div>

              {isPasswordProtected && (
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password for protection"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b2cbf]"
                  />
                </div>
              )}
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

            {showDownloadMenu && (
              <div className="mb-4 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={downloadAsPDF}
                  className="px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={downloadAsHTML}
                  className="px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors"
                >
                  Download HTML
                </button>
                <button
                  onClick={downloadAsMarkdown}
                  className="px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors"
                >
                  Download MD
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white/50 rounded-md text-sm text-gray-800"
                />
                <button
                  onClick={() => copyToClipboard(shareableLink)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {!shortLink && !shortLinkError && (
                <div className="flex justify-center">
                  <button
                    onClick={handleShortenUrl}
                    disabled={isShortening}
                    className={`text-sm px-4 py-2 rounded-md transition-colors ${
                      isShortening
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-[#7b2cbf] text-white hover:bg-[#9d4edd]'
                    }`}
                  >
                    {isShortening ? 'Generating short link...' : 'Generate Short Link'}
                  </button>
                </div>
              )}

              {shortLink && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={`https://${shortLink}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white/50 rounded-md text-sm text-gray-800"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://${shortLink}`)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7b2cbf] text-white rounded-md hover:bg-[#9d4edd] transition-colors whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Short URL</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {shortLinkError && (
                <div className="text-red-500 text-sm text-center">
                  Failed to generate short link. Please try again later.
                </div>
              )}
            </div>
          </div>
        )}

        {htmlContent && isPasswordValid && (
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