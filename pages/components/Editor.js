import { useState, useEffect, useRef } from 'react';
import '../../styles/Editor.module.css';
import io from 'socket.io-client';
import { sanitize } from "isomorphic-dompurify";
import { highlightSyntax } from '../util/codeProcessing.js';

const Editor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [socket, setSocket] = useState(null);
  const htmlEditorRef = useRef(null);
  const cssEditorRef = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
      newSocket.emit('requestCurrentState');
    });

    newSocket.on('currentState', (state) => {
      setHtmlCode(state.htmlCode);
      setCssCode(state.cssCode);
    });

    newSocket.on('htmlCodeUpdate', (updatedHtmlCode) => {
      setHtmlCode(updatedHtmlCode);
    });

    newSocket.on('cssCodeUpdate', (updatedCssCode) => {
      setCssCode(updatedCssCode);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);



  const handleHtmlCodeChange = (event) => {
    const newHtmlCode = event.target.value;
    setHtmlCode(newHtmlCode);
    socket?.emit('htmlCodeUpdate', newHtmlCode);
  };

  const handleCssCodeChange = (event) => {
    const newCssCode = event.target.value;
    setCssCode(newCssCode);
    socket?.emit('cssCodeUpdate', newCssCode);
  };

  const createMarkup = () => {
    return { __html: `<style>${sanitize(cssCode)}</style>${sanitize(htmlCode)}` };
  };

  return (
    <div className="editor-container">
      <div className="code-inputs">
        <textarea
          ref={htmlEditorRef}
          rows={30}
          columns={40}
          onInput={handleHtmlCodeChange}
          className="html-editor"
          placeholder="HTML Code"
        />
        <textarea
          ref={cssEditorRef}
          rows={30}
          columns={40}
          onInput={handleCssCodeChange}
          className="css-editor"
          placeholder="CSS Code"
        />
      </div>
      <div 
        className="preview-pane" 
        dangerouslySetInnerHTML={createMarkup()} 
      />
    </div>
  );
};

export default Editor;
