/** @jsxImportSource @emotion/react */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useRef,useEffect } from 'react';
import { css } from '@emotion/react';
import { FaTrash ,FaDownload } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import {api, handleVideoProcessing} from '../apis'

const MainScreen: React.FC = () => {  
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [multipleVideos, setMultipleVideos] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [nlpResponse, setNlpResponse] = useState<string>('');
  const [resultVideoSrc, setResultVideoSrc] = useState<string[]>([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [videoUrlArr, setVideoUrlArr] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => 
    () => multipleVideos.forEach(URL.revokeObjectURL)
  , [multipleVideos]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      setIsVideoLoaded(true);
    }
  };

  const handleRemoveVideo = () => {
    setVideoSrc('');
    setResultVideoSrc([]);
    setNlpResponse('');
    setVideoUrlArr([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }; 

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const videoUrls = files.map(file => URL.createObjectURL(file as Blob));
      setMultipleVideos(videoUrls);
    }
  };
  
  const handleRemoveMultipleVideos = () => {
    setVideoSrc('');
    setMultipleVideos([]);
    setResultVideoSrc([]);
    setNlpResponse('');
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    if (!videoSrc && multipleVideos.length === 0) return;
    setProcessing(true);
    setNlpResponse('');
    setResultVideoSrc([]);
    setVideoUrlArr([]);
    try {
      const API_BASE_URL = 'http://localhost:3000/api';
      let files: File[] = [];
  
      if (videoSrc) {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
          throw new Error('No file selected');
        }
        files = [file];
      } else {
        const fileList = multipleFileInputRef.current?.files;
        if (!fileList || fileList.length === 0) {
          throw new Error('No files selected');
        }
        files = Array.from(fileList);
      }
  
      // Upload files first
      const formData = new FormData();
      files.forEach(file => formData.append('videos', file));
  
      const uploadResponse = await fetch(`${API_BASE_URL}/upload-multiple`, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
      }
  
      const uploadResult = await uploadResponse.json();
      const {filePaths} = uploadResult;
  
      // Now process the uploaded files
      const processResponse = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, filePaths }),
      });
  
      if (!processResponse.ok) {
        throw new Error('Failed to process videos');
      }
  
      const result = await processResponse.json();
  
      setNlpResponse(result.nlpResponse);
      if (result.outputPaths && result.outputPaths.length > 0) {
        if (result.outputPaths.length === 1) {
          setResultVideoSrc([`${API_BASE_URL}/videos/${result.outputPaths[0]}`]);
        } else {
          setVideoUrlArr(result.outputPaths.map(path => `${path}`));
        }
      }
  
    } catch (error) {
      console.error('Error processing video:', error);
      setNlpResponse('Error processing your request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };  

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handlePromptSubmit();
    }
  };

  const downloadVideosSequentially = async (urls: string[]) => {
  // eslint-disable-next-line no-restricted-syntax
    for (const url of urls) {     
      await api.downloadVideo(url);
    }

  };

  const styles = {
    headertext: css`
      color: #00C8F2;
      margin-bottom: 20px;
      margin-top:20px;
      text-align:center;
      font-family:Times New Roman
    `,
    videoContainer: css`
      aspect-ratio: 16 / 9;
      background-color: black;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 18px;
      text-align: center;
      margin-top:10px;
      margin-bottom:60px
    `,
    videoContainer1: css`
      color: white;
      font-size: 18px;
      margin-top:10px;
      margin-bottom:60px
    `,
    video: css`
      width: 100%;
      height: 100%;
      object-fit: contain;
    `,
    button: css`
      margin-bottom: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #00C8F2;
      color: white;
      border-radius: 10px;
      border: none;
      &:hover {
        background-color: white;
        color: #00C8F2;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    `,
    removeButton: css`
      background-color: #ff4d4d;
      &:hover {
        background-color: white;
        color: #ff4d4d;
      }
    `,
    promptInput: css`
      width: 88%;
      padding: 10px;
      font-size: 16px;
      font-family: 'Times New Roman';
       &::placeholder {
        font-family: 'Times New Roman';
        font-size: 14px;
        color: #888;
      }
    `,
    sendButton: css`
      width: 12%;
    `,    
    downloadButton: css`
      margin-top: 10px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      &:hover {
        background-color: #218838;
      }
    `,
  };

  return (
    <div className="container-fluid">
      <h3 css={styles.headertext}>Let us edit video from now</h3>
      <div className="row">
        <div className="col-lg-7"> 
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            accept="video/*"
            onChange={handleMultipleFileUpload}
            ref={multipleFileInputRef}
            style={{ display: 'none' }}
            multiple
          />
          {videoSrc || multipleVideos.length > 0 ?(
            <button
              type="button"
              className="btn btn-danger mb-3"             
              onClick={videoSrc? handleRemoveVideo : handleRemoveMultipleVideos}
            >
              <FaTrash className="me-2" />
              <span css={{fontFamily:'Times New Roman'}}>Remove Video</span>
            </button>
          ) : (
            <>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => fileInputRef.current?.click()}
            >           
              <span css={{fontFamily:'Times New Roman'}}>Upload Single Video</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => multipleFileInputRef.current?.click()}
            >           
              <span css={{fontFamily:'Times New Roman'}}>Upload Multiple Videos</span>
            </button>
          </>
          )}
          <div >
            {videoSrc ? (     
              <div css={styles.videoContainer}>       
                <video css={styles.video} controls ref={videoRef} onLoadedData={() => setIsVideoLoaded(true)}>
                  <source src={videoSrc} type="video/mp4" />
                  <track kind="captions" src="captions.vtt" label="English" />
                  <span css={{fontFamily:'Times New Roman'}}>Your browser does not support the video tag.</span>
                </video>
              </div>             
              ) : multipleVideos.length > 0 ? (
                <div css={styles.videoContainer1}>
                  {multipleVideos.map((video, index) => (                
                    <video  css={{height:'60%',width:'40%',margin:'10px'}} controls>
                      <source src={video} type="video/mp4" />
                      <track kind="captions" src="captions.vtt" label="English" />
                      <span css={{fontFamily:'Times New Roman'}}>Your browser does not support the video tag.</span>
                    </video>
                    ))
                  }    
                </div>          
              ) : (
                <div css={styles.videoContainer}>
                  <p>No video uploaded</p>
                </div>
              )}
          </div>
          
          <div className="mb-3 d-flex">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your prompt here"
              className="form-control me-2"
              css={[styles.promptInput, { flexGrow: 1 }]}
            />
            <i className="bi bi-send"
            />
           <button 
              type="button" 
              className="btn btn-success"
              css={[
                styles.sendButton,
                {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily:'Times New Roman !important'                
                }
              ]}
              onClick={handlePromptSubmit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
              </svg>
              <span css={{fontFamily:'Times New Roman'}}>Send</span>
            </button>
          </div>
        </div>
        <div className="col-lg-5"> {/* This will take up 40% (5/12) of the width */}
          <h4 css={{textAlign:'center',color:'#00C8F2',fontFamily:'Times New Roman'}}>Result video</h4>
          {isProcessing ? (
            <div 
              className="d-flex justify-content-center align-items-center" 
              css={{ height: '80%' }}
            >
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only"/>
              </div>
            </div>
          ) : resultVideoSrc.length>0 ? (
            <> 
              <div css={styles.videoContainer}>
                <video css={styles.video} controls>
                  <source src={resultVideoSrc[0]} type="video/webm" />
                  <track kind="captions" src="path/to/captions.vtt" label="English" />
                  <span css={{fontFamily:'Times New Roman'}}>Your browser does not support the video tag.</span>
                </video>
              </div>   
              <button type='button'
                onClick={() => api.downloadVideo(resultVideoSrc[0].split('/').pop() || '')} 
                css={styles.downloadButton}
                disabled={!resultVideoSrc}
              >
                <FaDownload />
                <span css={{fontFamily:'Times New Roman'}}>Download Result</span>
              </button>           
            </>            
          ) :(videoUrlArr.length>0)?(
            <> 
            <div  css={styles.videoContainer1}>
                {videoUrlArr.map((url, index) => (                
                  
                    <video  controls css={{height:'60%',width:'40%',margin:'10px'}} >
                      <source src={`http://localhost:3000/api/videos/${url}`} type="video/webm" />
                      <track kind="captions" src="path/to/captions.vtt" label="English" />
                      <span css={{fontFamily:'Times New Roman'}}>Your browser does not support the video tag.</span>
                    </video>  
                ))}
              </div>
              <button type='button'
                onClick={() => downloadVideosSequentially(videoUrlArr)} 
                css={styles.downloadButton}
                disabled={!(videoUrlArr.length > 0)}
              >
                <FaDownload />
                <span css={{fontFamily:'Times New Roman'}}>Download Results</span>
              </button>           
            </>
          ): (
            <p css={{fontFamily:'Times New Roman',textAlign:'center',marginTop:'150px'}}>No result video yet</p>
          )}
          <p css={{fontFamily:'Times New Roman',textAlign:'center',marginTop:'30px'}}>{nlpResponse}</p>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;