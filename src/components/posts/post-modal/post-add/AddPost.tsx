import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/post-modal/post-add/AddPost.scss';
import ModalBoxContent from '@components/posts/post-modal/modal-box-content/ModalBoxContent';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { bgColors } from '@shared/services/utils/static.data';
import ModalBoxSelection from '@components/posts/post-modal/modal-box-content/ModalBoxSelection';
import Button from '@components/button/Button';
import { PostUtils } from '@shared/services/utils/post-utils.service';
import { closeModal, toggleGifModal } from '@shared/redux-toolkit/reducers/modal/modal.reducer';
import Giphy from '@components/giphy/Giphy';
import PropTypes from 'prop-types';
import { ImageUtils } from '@shared/services/utils/image-utils.service';
import { postService } from '@shared/services/api/post/post.service';
import Spinner from '@components/spinner/Spinner';

const AddPost = ({ selectedImage, selectedPostVideo }) => {
  const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
  const { gifUrl, image, privacy, video } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [allowedNumberOfCharacters] = useState('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
  const [postData, setPostData] = useState({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    video: ''
  });
  const [disable, setDisable] = useState(true);
  const [apiResponse, setApiResponse] = useState('');
  const [selectedPostImage, setSelectedPostImage] = useState();
  const [selectedVideo, setSelectedVideo] = useState();
  const counterRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dispatch = useDispatch();

  const maxNumberOfCharacters = 100;

  const selectBackground = (bgColor) => {
    PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
  };

  const postInputEditable = (event, textContent) => {
    const currentTextLength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextLength;
    counterRef.current.textContent = `${counter}/100`;
    setDisable(currentTextLength <= 0 && !postImage);
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const onKeyDown = (event) => {
    const currentTextLength = event.target.textContent.length;
    if (currentTextLength === maxNumberOfCharacters && event.keyCode !== 8) {
      event.preventDefault();
    }
  };

  const clearImage = () => {
    setSelectedVideo(null);
    PostUtils.clearImage(postData, '', inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };

  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || 'Public';
      postData.gifUrl = gifUrl;
      postData.profilePicture = profile?.profilePicture;
      if (selectedPostImage || selectedVideo || selectedImage || selectedPostVideo) {
        let result = '';
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }

        if (selectedVideo) {
          result = await ImageUtils.readAsBase64(selectedVideo);
        }

        if (selectedImage) {
          result = await ImageUtils.readAsBase64(selectedImage);
        }

        if (selectedPostVideo) {
          result = await ImageUtils.readAsBase64(selectedPostVideo);
        }
        const type = selectedPostImage || selectedImage ? 'image' : 'video';
        if (type === 'image') {
          postData.image = result;
          postData.video = '';
        } else {
          postData.video = result;
          postData.image = '';
        }
        const response = await PostUtils.sendPostWithFileRequest(
          type,
          postData,
          imageInputRef,
          setApiResponse,
          setLoading,
          setDisable,
          dispatch
        );
        if (response && response?.data?.message) {
          setHasVideo(false);
          PostUtils.closePostModal(dispatch);
        }
      } else {
        const response = await postService.createPost(postData);
        if (response) {
          setApiResponse('success');
          setLoading(false);
          setHasVideo(false);
          PostUtils.closePostModal(dispatch);
        }
      }
    } catch (error) {
      setHasVideo(false);
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  };

  useEffect(() => {
    PostUtils.positionCursor('editable');
  }, []);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModal());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);

  useEffect(() => {
    if (gifUrl) {
      setPostImage(gifUrl);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    } else if (image) {
      setPostImage(image);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    } else if (video) {
      setHasVideo(true);
      setPostImage(video);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    }
  }, [gifUrl, image, postData, video]);

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{
              height:
                selectedPostImage || hasVideo || gifUrl || image || postData?.gifUrl || postData?.image
                  ? '700px'
                  : 'auto'
            }}
          >
            {loading && (
              <div className="modal-box-loading" data-testid="modal-box-loading">
                <span>Posting...</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2>Create Post</h2>
              <button className="modal-box-header-cancel" onClick={() => closePostModal()}>
                X
              </button>
            </div>
            <hr />
            <ModalBoxContent />

            {!postImage && (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  style={{ background: `${textAreaBackground}` }}
                >
                  <div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
                    <div className="flex-row">
                      <div
                        data-testid="editable"
                        id="editable"
                        name="post"
                        ref={(el) => {
                          inputRef.current = el;
                          inputRef?.current?.focus();
                        }}
                        className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${
                          postData.post.length === 0 && textAreaBackground !== '#ffffff' ? 'defaultInputTextColor' : ''
                        }`}
                        contentEditable={true}
                        onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                        onKeyDown={onKeyDown}
                        data-placeholder="What's on your mind?..."
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {postImage && (
              <>
                <div className="modal-box-image-form">
                  <div
                    data-testid="post-editable"
                    name="post"
                    id="editable"
                    ref={(el) => {
                      imageInputRef.current = el;
                      imageInputRef?.current?.focus();
                    }}
                    className="post-input flex-item"
                    contentEditable={true}
                    onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                    onKeyDown={onKeyDown}
                    data-placeholder="What's on your mind?..."
                  ></div>
                  <div className="image-display">
                    <div
                      className="image-delete-btn"
                      data-testid="image-delete-btn"
                      style={{ marginTop: `${hasVideo ? '-40px' : ''}` }}
                      onClick={() => clearImage()}
                    >
                      <FaTimes />
                    </div>
                    {!hasVideo && <img data-testid="post-image" className="post-image" src={`${postImage}`} alt="" />}
                    {hasVideo && (
                      <div style={{ marginTop: '-40px' }}>
                        <video width="100%" controls src={`${video}`} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((color, index) => (
                  <li
                    data-testid="bg-colors"
                    key={index}
                    className={`${color === '#ffffff' ? 'whiteColorBorder' : ''}`}
                    style={{ backgroundColor: `${color}` }}
                    onClick={() => {
                      PostUtils.positionCursor('editable');
                      selectBackground(color);
                    }}
                  ></li>
                ))}
              </ul>
            </div>
            <span className="char_count" data-testid="allowed-number" ref={counterRef}>
              {allowedNumberOfCharacters}
            </span>

            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} setSelectedVideo={setSelectedVideo} />

            <div className="modal-box-button" data-testid="post-button">
              <Button label="Create Post" className="post-button" disabled={disable} handleClick={createPost} />
            </div>
          </div>
        )}
        {gifModalIsOpen && (
          <div className="modal-giphy" data-testid="modal-giphy">
            <div className="modal-giphy-header">
              <Button
                label={<FaArrowLeft />}
                className="back-button"
                disabled={false}
                handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
              />
              <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
          </div>
        )}
      </PostWrapper>
    </>
  );
};
AddPost.propTypes = {
  selectedImage: PropTypes.any,
  selectedPostVideo: PropTypes.any
};
export default AddPost;
