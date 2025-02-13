import Lightbox from "react-image-lightbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import _ from "lodash";
import moment from "moment";
import { RadioButton } from "primereact/radiobutton";
import { ListBox } from "primereact/listbox";
import { removeVietnameseTones } from "../../Utils/Helpler";
import ErrorFeedImage from "../../asset/images/Background03.svg";
import TextareaAutosize from "react-textarea-autosize";
import DEFAULT_AVATAR from "../../asset/images/empty_avatar.png";
import ERROR_AVATAR from "../../asset/images/error_avatar.jpg";
import ERROR_IMAGE from "../../asset/images/error_image.png";
import { Skeleton } from "primereact/skeleton";
import {
  EditFeedInfo,
  UpdateFeedList,
  UploadPhotoFeed,
} from "../../store/NewFeedController";

const stusLike = "thích";
const stusComment = "bình luận";
const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const HASHTAG = "HASHTAG";
const USERTAG = "USERTAG";
const POST_EDITION = "POST_EDITION";
const POST_CREATION = "POST_CREATION";
const KEY_START_TAG = "*START_TAG*";
const KEY_END_TAG = "*END_TAG*";
const COMMENT = "COMMENT";
const widthFeed = 600;
const primaryColor = "#FFAC1C";

export const RenderDialogPrimary = ({
  visibleBS,
  currentBS,
  userInfo,
  setVisibleBS,
  objectUser,
  setMutate,
  hostUrlProfile,
  handleJumpModal,
  refContentPost,
  refTypeImage,
  renderFooterAction,
}) => {
  return (
    <Dialog
      header={currentBS.dialogTitle}
      visible={visibleBS}
      className="dialog_new_feed_creation"
      style={{ width: "40vw", height: "70vh" }}
      resizable={true}
      position="top"
      footer={renderFooterAction}
      onHide={() => setVisibleBS(false)}
    >
      <div
        className="hide_scroll_bar"
        style={{
          height: "70vh",
          overflowY:
            currentBS.optionType === POST_CREATION ? "scroll" : "hidden",
        }}
      >
        {currentBS.optionType === POST_CREATION ||
        currentBS.optionType === POST_EDITION ? (
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <img
                src={hostUrlProfile}
                alt=""
                onError={(e) => (e.target.src = ERROR_AVATAR)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  marginLeft: 15,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>{userInfo.employeeName || ""}</span>
                <div
                  style={{
                    marginTop: 5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => handleJumpModal(PUBLIC)}
                    label={currentBS.isPublicPost ? "Công khai" : "Tuỳ chỉnh"}
                    style={{ padding: 4, marginRight: 10 }}
                    icon={
                      currentBS.isPublicPost
                        ? "pi pi-globe"
                        : "pi pi-user-minus"
                    }
                    className="p-button-outlined p-button-secondary btn__hover"
                    iconPos="left"
                  />
                  <Button
                    onClick={() => handleJumpModal(HASHTAG)}
                    label="Hashtag"
                    style={{ padding: 4 }}
                    icon="pi pi-tags"
                    className="p-button-outlined p-button-secondary btn__hover"
                    iconPos="left"
                  />
                </div>
              </div>
            </div>
            <div
              className="hide_scroll_bar"
              style={{
                marginBottom: 10,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflowY: "scroll",
              }}
            >
              <div style={{ marginBottom: 10, width: "100%" }}>
                <TextareaAutosize
                  ref={refContentPost}
                  minRows={3}
                  value={currentBS.contentPost || ""}
                  onChange={(e) =>
                    onChangeContentPost(e.target.value, currentBS, objectUser, {
                      setMutate,
                    })
                  }
                  style={{
                    width: "100%",
                    background: "inherit",
                    border: "none",
                    outline: "none",
                    color: "inherit",
                    fontSize: 18,
                    overflow: "hidden",
                  }}
                  placeholder="Nội dung..."
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px,auto))",
                  gridGap: 10,
                }}
              >
                {currentBS.selectedImage.map((image, idx) => {
                  return (
                    <div
                      key={idx}
                      style={{ position: "relative", overflow: "hidden" }}
                    >
                      <img
                        src={image.uri}
                        alt=""
                        style={{
                          width: 160,
                          height: 160,
                          borderRadius: 5,
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        onClick={() =>
                          onRemoveImage(idx, currentBS, { setMutate })
                        }
                        icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-text btn__hover"
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 10,
                          width: 30,
                          height: 30,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Button
                onClick={() => handleJumpModal(USERTAG)}
                icon="pi pi-user-plus"
                style={{ width: 35, height: 35 }}
                className="p-button-rounded p-button-help p-button-outlined btn__hover"
              />
              <Button
                onClick={() => refTypeImage?.current?.click()}
                icon="pi pi-images"
                style={{ width: 33, height: 33 }}
                className="p-button-rounded p-button-danger p-button-outlined btn__hover"
              />
              <input
                ref={refTypeImage}
                type="file"
                accept="image/*"
                multiple="multiple"
                onChange={(e) =>
                  onUploadImageCreatePost(e, currentBS, userInfo, { setMutate })
                }
                style={{ display: "none" }}
              />
            </div>
          </div>
        ) : currentBS.optionType === PUBLIC ? ( // * MODAL SELECT VIEWER
          <div className="hide_scroll_bar" style={{ height: "100%" }}>
            <div
              className="btn__hover"
              onClick={() =>
                handleChangePublicPost(true, currentBS, { setMutate })
              }
              style={{
                cursor: "pointer",
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Button
                  icon="pi pi-globe"
                  className="p-button-rounded p-button-secondary p-button-outlined"
                  style={{ width: 35, height: 35 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 10,
                  }}
                >
                  <label style={{ fontSize: 15 }}>Công khai</label>
                  <span
                    style={{ fontSize: 11, fontStyle: "italic", marginTop: 2 }}
                  >
                    Mọi người có thể xem
                  </span>
                </div>
              </div>
              <RadioButton
                checked={currentBS.isPublicPost}
                onChange={() =>
                  handleChangePublicPost(true, currentBS, { setMutate })
                }
              />
            </div>
            <div
              className="btn__hover"
              onClick={() =>
                handleChangePublicPost(false, currentBS, { setMutate })
              }
              style={{
                cursor: "pointer",
                padding: 10,
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Button
                  icon="pi pi-cog"
                  className="p-button-rounded p-button-secondary p-button-outlined"
                  style={{ width: 35, height: 35 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 10,
                  }}
                >
                  <label style={{ fontSize: 15 }}>Tuỳ chỉnh</label>
                  <span
                    style={{ fontSize: 11, fontStyle: "italic", marginTop: 2 }}
                  >
                    Chỉ người được chọn mới có thể xem
                  </span>
                </div>
              </div>
              <RadioButton
                checked={!currentBS.isPublicPost}
                onChange={() =>
                  handleChangePublicPost(false, currentBS, { setMutate })
                }
              />
            </div>
          </div>
        ) : currentBS.optionType === PRIVATE ? ( // * MODAL SELECT USER PRIVATE
          <div className="hide_scroll_bar" style={{ height: "100%" }}>
            <ListBox
              className="hide_scroll_bar"
              value={currentBS.selectedUser}
              options={currentBS.listUser}
              onChange={(e) =>
                onSelectUserShare(e.value, currentBS, { setMutate })
              }
              multiple
              filter
              optionLabel="employeeName"
              optionValue="employeeId"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
            />
          </div>
        ) : currentBS.optionType === HASHTAG ? ( // * MODAL SELECT HASHTAG
          <div className="hide_scroll_bar" style={{ height: "100%" }}>
            <ListBox
              className="hide_scroll_bar"
              value={currentBS.selectedHashtag}
              options={currentBS.listHashtag}
              onChange={(e) =>
                onSelectHashtag(e.value, currentBS, { setMutate })
              }
              multiple
              filter
              optionLabel="hasTag"
              optionValue="hasTag"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
            />
          </div>
        ) : (
          currentBS.optionType === USERTAG && ( // * MODAL SELECT USER TAG
            <div
              className="hide_scroll_bar"
              style={{ height: "100%", overflow: "scroll" }}
            >
              {currentBS.listUser?.map((user, idx) => {
                return (
                  <div
                    onClick={() =>
                      onSelectUsertag(user.employeeName, currentBS, {
                        handleJumpModal,
                      })
                    }
                    key={idx}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <i className="bi bi-person-fill" style={{ fontSize: 20 }} />
                    <span style={{ marginLeft: 5 }}>{user.employeeName}</span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </Dialog>
  );
};
export const RenderFeedDetail = ({
  feed,
  index,
  userInfo,
  currentBS,
  setMutate,
  setVisibleOption,
  setVisibleImageViewer,
  onGoToFeedDetail,
  showToast,
}) => {
  const feedData = JSON.parse(feed?.feedData || "{}") || {};
  const arrayHashtag =
    typeof feed?.hasTag === "string" && feed?.hasTag !== ""
      ? feed?.hasTag?.split(",")
      : [];
  const {
    employeeName,
    feedLike,
    feedType,
    feedComment,
    imagePath,
    likeList,
    urlProfile,
    createDate,
  } = feed;
  const images = feedData?.photoList || [];
  const userUrlProfile =
    !urlProfile || urlProfile === "" ? DEFAULT_AVATAR : urlProfile;
  return (
    <div>
      <div
        style={{
          width: "100%",
          padding: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => onGoToFeedDetail(feed)}
          style={{ width: "10%", cursor: "pointer" }}
        >
          <img
            src={userUrlProfile}
            alt=""
            onError={(e) => (e.target.src = ERROR_AVATAR)}
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ width: "90%", marginLeft: 15 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                onClick={() => onGoToFeedDetail(feed)}
                className="text_hover_underline"
                style={{ fontSize: 19, cursor: "pointer" }}
              >
                {employeeName}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 5,
                  marginBottom: 5,
                  marginLeft: 10,
                }}
              >
                <i
                  className={
                    feedType === "PUBLIC" ? "pi pi-globe" : "pi pi-cog"
                  }
                  style={{ fontSize: 16 }}
                />
                <span
                  style={{ marginLeft: 5, fontStyle: "italic", fontSize: 14 }}
                >
                  {createDate}
                </span>
              </div>
            </div>
            <div
              onClick={() =>
                onOpenOption(feed, index, currentBS, {
                  setMutate,
                  setVisibleOption,
                })
              }
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-three-dots" style={{ fontSize: 25 }} />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(10px, auto))",
              gridGap: 5,
            }}
          >
            {arrayHashtag.map((tag, idxTag) => {
              return (
                <Button
                  key={idxTag}
                  label={tag}
                  onClick={() => window.open(`/newfeed?q=${encodeURI(tag)}`)}
                  className="p-button-outlined p-button-secondary btn__hover"
                  style={{ padding: 3 }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          margin: 5,
          paddingLeft: 10,
          paddingRight: 10,
          wordBreak: "break-word",
        }}
      >
        <span>{renderHashtagText(feedData?.content)}</span>
      </div>
      <PhotoGrid
        photos={images}
        imagePath={imagePath}
        currentBS={currentBS}
        setVisibleImageViewer={setVisibleImageViewer}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <span style={{ fontSize: 15, paddingLeft: 5 }}>
          {feedLike?.toString() || "0"} lượt thích
        </span>
        <span style={{ fontSize: 15, paddingRight: 5 }}>
          {feedComment?.length || "0"} bình luận
        </span>
      </div>
      <hr
        style={{
          border: "0.5px solid var(--bluegray-400)",
          margin: 0,
          marginBottom: 5,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div
          onClick={() => onLikeFeed(feed, userInfo, { setMutate })}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "5px 20px",
            borderRadius: 5,
          }}
          className="btn__hover"
        >
          <i
            className="bi bi-hand-thumbs-up"
            style={{
              fontSize: 20,
              color: likeList?.[userInfo.employeeId] ? primaryColor : "inherit",
            }}
          />
          <span
            style={{
              fontSize: 18,
              marginLeft: 5,
              color: likeList?.[userInfo.employeeId] ? primaryColor : "inherit",
            }}
          >
            Thích
          </span>
        </div>
        <div
          onClick={() => onGoToFeedDetail(feed)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "5px 20px",
            borderRadius: 5,
          }}
          className="btn__hover"
        >
          <i className="bi bi-chat" style={{ fontSize: 20 }} />
          <span style={{ fontSize: 18, marginLeft: 5 }}>Bình luận</span>
        </div>
        <div
          onClick={() => onShareFeed(feed, { showToast })}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "5px 20px",
            borderRadius: 5,
          }}
          className="btn__hover"
        >
          <i className="bi bi-share" style={{ fontSize: 20 }} />
          <span style={{ fontSize: 18, marginLeft: 5 }}>Chia sẻ</span>
        </div>
      </div>
      <hr
        style={{
          border:
            feedComment?.length > 0
              ? "0.5px solid var(--bluegray-400)"
              : "transparent",
          margin: 0,
          marginTop: 5,
        }}
      />
    </div>
  );
};
export const RenderDialogOption = ({
  userInfo,
  currentBS,
  listUser,
  visibleOption,
  setVisibleBS,
  setVisibleOption,
  showToast,
}) => {
  return (
    <Dialog
      header="Tuỳ chọn"
      visible={visibleOption}
      position={"right"}
      style={{ width: "30vw" }}
      onHide={() => setVisibleOption(false)}
      draggable={false}
      resizable={false}
    >
      <div>
        {userInfo?.employeeId === currentBS?.item?.employeeId && ( // * Host Of The Post
          <div
            onClick={() =>
              handleDisplayBS(POST_EDITION, currentBS, listUser, {
                setVisibleOption,
                setVisibleBS,
              })
            }
            className="btn__hover"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 8,
            }}
          >
            <i className="bi bi-pencil-square" style={{ fontSize: 20 }} />
            <span style={{ fontSize: 17, marginLeft: 5 }}>
              Chỉnh sửa bài viết
            </span>
          </div>
        )}
        <div
          onClick={() =>
            onFollowFeed(currentBS, userInfo, { setVisibleOption, showToast })
          }
          className="btn__hover"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 8,
          }}
        >
          <i className={"bi bi-bell"} style={{ fontSize: 20 }} />
          <span style={{ fontSize: 17, marginLeft: 5 }}>
            {currentBS.item?.isFollowed ? "Bỏ theo dõi" : "Theo dõi"}
          </span>
        </div>
      </div>
    </Dialog>
  );
};
export const RenderComments = ({
  feed,
  refComment,
  refReplyComments,
  refTypeImageComment,
  refTypeImageReplyComment,
  setVisibleImageViewer,
  currentBS,
  setMutate,
  inputValues,
  userInfo,
  additionalInput,
  hostUrlProfile,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <div>
        {(feed.feedComment || []).map((comment, indexComment) => {
          const replyComments = Array.isArray(comment.replyComments)
            ? comment.replyComments
            : [];
          const likedCommentColor = comment?.whoseLiked?.[userInfo.employeeId]
            ? primaryColor
            : "inherit";
          const avartarComment =
            !comment.avatarUrl || comment.avatarUrl === ""
              ? DEFAULT_AVATAR
              : comment.avatarUrl;
          const photoComment =
            comment.temp_image_base64 ||
            `${comment.rootPhoto || ""}${comment.photo}`;
          return (
            <div
              key={indexComment}
              style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ display: "flex" }}>
                <img
                  src={avartarComment}
                  alt=""
                  onError={(e) => (e.target.src = ERROR_AVATAR)}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "var(--surface-200)",
                      wordBreak: "break-word",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: "bold" }}>
                      {comment.employeeName}{" "}
                      {comment.employeeId === feed.employeeId ? (
                        <i
                          className="bi bi-check-circle-fill"
                          style={{ fontSize: 13, color: "rgb(1,132,200)" }}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                    <span style={{ fontSize: 15 }}>{comment.comment}</span>
                  </div>
                  {comment.photo && (
                    <div
                      onClick={() =>
                        onOpenImageViewer(
                          0,
                          [{ Photo: comment.photo }],
                          comment.rootPhoto,
                          currentBS,
                          { setVisibleImageViewer }
                        )
                      }
                      style={{ padding: 5, cursor: "pointer" }}
                    >
                      <img
                        src={photoComment}
                        alt=""
                        onError={(e) => (e.target.src = ERROR_IMAGE)}
                        style={{
                          width: 150,
                          height: 90,
                          borderRadius: 10,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 5,
                      paddingLeft: 15,
                    }}
                  >
                    <div
                      onClick={() =>
                        onLikeComment(feed, indexComment, currentBS, userInfo, {
                          setMutate,
                        })
                      }
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <span
                        className="text_hover_underline"
                        style={{ fontSize: 14, color: likedCommentColor }}
                      >
                        {comment.likes?.toString() || "0"} thích
                      </span>
                    </div>
                    <div
                      onClick={() =>
                        onAppendTextInput(
                          feed,
                          indexComment,
                          refReplyComments,
                          additionalInput,
                          { setMutate }
                        )
                      }
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <span
                        className="text_hover_underline"
                        style={{ fontSize: 14 }}
                      >
                        {comment?.replyComments?.length || "0"} trả lời
                      </span>
                    </div>
                    <span style={{ fontSize: 14, fontStyle: "italic" }}>
                      {moment(comment.createdAt).startOf("minute").fromNow()}
                    </span>
                  </div>
                </div>
              </div>
              {replyComments.map((replyComment, indexReplyComment) => {
                const likedReplyCommentColor = replyComment?.whoseLikedReply?.[
                  userInfo.employeeId
                ]
                  ? primaryColor
                  : "inherit";
                const avartarReplyComment =
                  !replyComment.avatarUrl || replyComment.avatarUrl === ""
                    ? DEFAULT_AVATAR
                    : replyComment.avatarUrl;
                const photoReplyComment =
                  replyComment.temp_image_base64 ||
                  `${replyComment.rootPhoto || ""}${replyComment.photo}`;
                return (
                  <div
                    key={indexReplyComment}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div style={{ width: "10%" }} />
                    <div style={{ width: "90%", display: "flex", padding: 5 }}>
                      <img
                        src={avartarReplyComment}
                        alt=""
                        onError={(e) => (e.target.src = ERROR_AVATAR)}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            background: "var(--surface-200)",
                            wordBreak: "break-word",
                            padding: 10,
                            borderRadius: 15,
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: "bold" }}>
                            {replyComment.employeeName}{" "}
                            {replyComment.employeeId === feed.employeeId ? (
                              <i
                                className="bi bi-check-circle-fill"
                                style={{
                                  fontSize: 13,
                                  color: "rgb(1,132,200)",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                          <span style={{ fontSize: 15 }}>
                            {replyComment.replyComment}
                          </span>
                        </div>
                        {replyComment.photo && (
                          <div
                            onClick={() =>
                              onOpenImageViewer(
                                0,
                                [{ Photo: replyComment.photo }],
                                replyComment.rootPhoto,
                                currentBS,
                                { setVisibleImageViewer }
                              )
                            }
                            style={{ padding: 5, cursor: "pointer" }}
                          >
                            <img
                              src={photoReplyComment}
                              alt=""
                              onError={(e) => (e.target.src = ERROR_IMAGE)}
                              style={{
                                width: 150,
                                height: 90,
                                borderRadius: 10,
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 5,
                            paddingLeft: 15,
                          }}
                        >
                          <div
                            onClick={() =>
                              onLikeReplyComment(
                                feed,
                                indexComment,
                                indexReplyComment,
                                currentBS,
                                userInfo,
                                { setMutate }
                              )
                            }
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              marginRight: 10,
                            }}
                          >
                            <span
                              className="text_hover_underline"
                              style={{
                                fontSize: 14,
                                color: likedReplyCommentColor,
                              }}
                            >
                              {replyComment.likes?.toString() || "0"} thích
                            </span>
                          </div>
                          <span style={{ fontSize: 14, fontStyle: "italic" }}>
                            {moment(replyComment.createdAt)
                              .startOf("minute")
                              .fromNow()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {additionalInput[indexComment] !== undefined && (
                <div
                  style={{ display: "flex", alignItems: "center", padding: 5 }}
                >
                  <div style={{ width: "10%" }} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "90%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={hostUrlProfile}
                        alt=""
                        onError={(e) => (e.target.src = ERROR_AVATAR)}
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <InputText
                        ref={(ref) =>
                          (refReplyComments[`${feed?.feedKey}${indexComment}`] =
                            ref)
                        }
                        value={inputValues[indexComment] || ""}
                        onChange={(e) =>
                          onChangeForm(
                            e.target.value,
                            indexComment,
                            inputValues,
                            { setMutate }
                          )
                        }
                        onKeyUp={(e) =>
                          onReplyComment(
                            e,
                            feed,
                            indexComment,
                            inputValues,
                            currentBS,
                            userInfo,
                            { setMutate }
                          )
                        }
                        placeholder={"Trả lời bình luận..."}
                        style={{ marginLeft: 10 }}
                      />
                      <Button
                        disabled={
                          comment?.selectedImageReplyComment?.fileName !==
                          undefined
                        }
                        onClick={() =>
                          onClickImageTypeFile(
                            refTypeImageReplyComment,
                            "itemComment",
                            comment,
                            { currentBS, setMutate }
                          )
                        }
                        icon="pi pi-images"
                        style={{ marginLeft: 5 }}
                        className="p-button-text btn__hover"
                      />
                      <input
                        ref={refTypeImageReplyComment}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          onUploadImageComment(
                            e,
                            "selectedImageReplyComment",
                            currentBS,
                            userInfo,
                            { setMutate }
                          )
                        }
                        style={{ display: "none" }}
                      />
                    </div>
                    {comment?.selectedImageReplyComment?.uri !== undefined && (
                      <div style={{ marginTop: 15, display: "flex" }}>
                        <img
                          src={comment.selectedImageReplyComment?.uri}
                          alt=""
                          style={{
                            width: 200,
                            height: 110,
                            borderRadius: 5,
                            objectFit: "cover",
                          }}
                        />
                        <Button
                          onClick={() => {
                            comment.selectedImageReplyComment = {};
                            setMutate((e) => !e);
                          }}
                          icon="pi pi-times"
                          className="p-button-rounded p-button-danger p-button-text"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={hostUrlProfile}
          alt=""
          onError={(e) => (e.target.src = ERROR_AVATAR)}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <InputText
          ref={refComment}
          value={inputValues[COMMENT] || ""}
          onChange={(e) =>
            onChangeForm(e.target.value, COMMENT, inputValues, { setMutate })
          }
          onKeyUp={(e) =>
            onComment(e, feed, inputValues, currentBS, userInfo, { setMutate })
          }
          placeholder={"Viết bình luận..."}
          style={{ marginLeft: 10 }}
        />
        <Button
          disabled={feed?.selectedImageComment?.fileName !== undefined}
          onClick={() =>
            onClickImageTypeFile(refTypeImageComment, "item", feed, {
              currentBS,
              setMutate,
            })
          }
          icon="pi pi-images"
          style={{ marginLeft: 5 }}
          className="p-button-text btn__hover"
        />
        <input
          ref={refTypeImageComment}
          type="file"
          accept="image/*"
          onChange={(e) =>
            onUploadImageComment(
              e,
              "selectedImageComment",
              currentBS,
              userInfo,
              { setMutate }
            )
          }
          style={{ display: "none" }}
        />
      </div>
      {feed?.selectedImageComment?.uri !== undefined && (
        <div style={{ marginTop: 15, display: "flex" }}>
          <img
            src={feed.selectedImageComment?.uri}
            alt=""
            style={{
              width: 200,
              height: 110,
              borderRadius: 5,
              objectFit: "cover",
            }}
          />
          <Button
            onClick={() => {
              feed.selectedImageComment = {};
              setMutate((e) => !e);
            }}
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
          />
        </div>
      )}
    </div>
  );
};
export const ImageViewer = ({
  currentBS,
  setMutate,
  visibleImageViewer,
  setVisibleImageViewer,
}) => {
  const { imagesViewer, indexImageViewer } = currentBS;
  return (
    visibleImageViewer && (
      <Lightbox
        mainSrc={imagesViewer[indexImageViewer]}
        nextSrc={imagesViewer[(indexImageViewer + 1) % imagesViewer.length]}
        prevSrc={
          imagesViewer[
            (indexImageViewer + imagesViewer.length - 1) % imagesViewer.length
          ]
        }
        onCloseRequest={() => setVisibleImageViewer(false)}
        onMovePrevRequest={() => {
          currentBS.indexImageViewer =
            (indexImageViewer + imagesViewer.length - 1) % imagesViewer.length;
          setMutate((e) => !e);
        }}
        onMoveNextRequest={() => {
          currentBS.indexImageViewer =
            (indexImageViewer + 1) % imagesViewer.length;
          setMutate((e) => !e);
        }}
      />
    )
  );
};
const PhotoGrid = ({ photos, imagePath, currentBS, setVisibleImageViewer }) => {
  const lenPhotos = photos.length;
  const widthImg =
    lenPhotos === 1 || lenPhotos === 3 ? widthFeed : widthFeed * 0.5;
  const heighImg = lenPhotos === 1 ? widthFeed : widthFeed * 0.5;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: lenPhotos === 3 ? "none" : `1fr 1fr`,
      }}
    >
      {(photos?.slice(0, 4) || []).map((image, idx) => {
        return (
          <div
            key={idx}
            onClick={() =>
              onOpenImageViewer(idx, photos, imagePath, currentBS, {
                setVisibleImageViewer,
              })
            }
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={imagePath + image.Photo}
              alt=""
              onError={(e) => (e.target.src = ErrorFeedImage)}
              style={{ width: widthImg, height: heighImg, objectFit: "cover" }}
            />
            {idx === 3 && lenPhotos > 4 && (
              <div
                onClick={() => {}}
                style={{
                  position: "absolute",
                  width: widthImg,
                  height: heighImg,
                  top: 0,
                  left: 0,
                  background: "black",
                  opacity: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 40, fontWeight: "bold" }}>
                  +{photos?.length - 4}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
const handleChangePublicPost = (boolean, currentBS, { setMutate }) => {
  currentBS.isPublicPost = boolean;
  if (!boolean) {
    currentBS.optionType = PRIVATE;
  }
  setMutate((e) => !e);
};
const onOpenOption = (
  item,
  index,
  currentBS,
  { setMutate, setVisibleOption }
) => {
  currentBS.item = item;
  currentBS.index = index;
  setMutate((e) => !e);
  setVisibleOption(true);
};
export const renderHashtagText = (str = "") => {
  const lenStartKey = KEY_START_TAG.length;
  try {
    const arr = str.split(" "),
      returnStr = [];
    for (let i = 0, lenArr = arr.length; i < lenArr; i++) {
      const isLastItem = i === lenArr - 1;
      if (arr[i].startsWith(KEY_START_TAG)) {
        returnStr.push(
          <span key={i} style={{ color: "rgb(1,132,200)" }}>
            @{arr[i].slice(lenStartKey, arr[i].lastIndexOf(KEY_END_TAG))}
            {isLastItem ? "" : " "}
          </span>
        );
      } else {
        returnStr.push(
          <span key={i} style={{}}>
            {arr[i]}
            {isLastItem ? "" : " "}
          </span>
        );
      }
    }
    return returnStr;
  } catch (e) {
    return <span key={-1}>{str}</span>;
  }
};
const onOpenImageViewer = (
  index,
  photos,
  imagePath,
  currentBS,
  { setVisibleImageViewer }
) => {
  currentBS.imagesViewer = photos.map(
    (e) => window.location.origin + imagePath + e.Photo
  );
  currentBS.indexImageViewer = index;
  setVisibleImageViewer(true);
};
const onUploadImageCreatePost = (event, currentBS, userInfo, { setMutate }) => {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0, lenFiles = event.target.files.length; i < lenFiles; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = function () {
        const realImageName = escape(event.target.files[i]?.name);
        const ext = realImageName.substring(
          realImageName.lastIndexOf(".") + 1,
          realImageName.length
        );
        currentBS.selectedImage.push({
          uri: URL.createObjectURL(event.target.files[i]),
          fileName: `${userInfo.employeeId}_${generateString()}.${ext}`,
          imageBase64: reader.result?.replace("data:image/png;base64,", ""),
        });
        setMutate((e) => !e);
      };
      setMutate((e) => !e);
    }
  }
};
const onUploadImageComment = (
  event,
  stateName,
  currentBS,
  userInfo,
  { setMutate }
) => {
  if (event.target.files && event.target.files[0]) {
    for (let i = 0, lenFiles = event.target.files.length; i < lenFiles; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = function () {
        const realImageName = escape(event.target.files[i]?.name);
        const ext = realImageName.substring(
          realImageName.lastIndexOf(".") + 1,
          realImageName.length
        );
        const imageObject = {
          uri: URL.createObjectURL(event.target.files[i]),
          fileName: `${userInfo.employeeId}_${generateString()}.${ext}`,
          imageBase64: reader.result?.replace("data:image/png;base64,", ""),
        };
        if (stateName === "selectedImageComment") {
          const feed = currentBS?.item || {};
          feed[stateName] = imageObject;
        } else if (stateName === "selectedImageReplyComment") {
          const itemComment = currentBS?.itemComment || {};
          itemComment[stateName] = imageObject;
        }
        setMutate((e) => !e);
      };
      setMutate((e) => !e);
    }
  }
};
const onClickImageTypeFile = (
  ref,
  keyObject,
  object,
  { currentBS, setMutate }
) => {
  try {
    ref?.current?.click();
    currentBS[keyObject] = object;
    setMutate((e) => !e);
  } catch (e) {}
};
const onRemoveImage = (index, currentBS, { setMutate }) => {
  try {
    currentBS.selectedImage.splice(index, 1);
    setMutate((e) => !e);
  } catch (e) {}
};
const onChangeContentPost = (value, currentBS, objectUser, { setMutate }) => {
  try {
    const isRemove = currentBS.contentPost.length > value.length;
    const arr = value.split(" ") || [];
    let content = "",
      contentFormat = "";
    for (let i = 0, lenArr = arr.length; i < lenArr; i++) {
      const checkStart = arr[i].startsWith("@");
      const checkUser = objectUser[arr[i]?.slice(1)] !== undefined;
      const isLast = i === lenArr - 1;
      if (isRemove && checkStart && checkUser && isLast) {
      } else {
        content += arr[i];
        contentFormat +=
          checkStart && checkUser
            ? `${KEY_START_TAG}${arr[i]?.slice(1)}${KEY_END_TAG}`
            : arr[i];
        content += isLast ? "" : " ";
        contentFormat += isLast ? "" : " ";
      }
    }
    currentBS.contentPost = content;
    currentBS.contentPostFormatted = contentFormat;
    setMutate((e) => !e);
  } catch (e) {
    console.log(e);
  }
};
const onSelectUsertag = (usertag, currentBS, { handleJumpModal }) => {
  try {
    usertag = usertag.split(" ").join("");
    if (!currentBS.contentPost) {
      assignContentPost(usertag, "", currentBS);
    } else {
      if (currentBS.contentPost[currentBS.contentPost?.length - 1] === " ") {
        assignContentPost(usertag, "", currentBS);
      } else {
        assignContentPost(" " + usertag, " ", currentBS);
      }
    }
    handleJumpModal(POST_CREATION);
  } catch (e) {}
};
const onSelectUserShare = (employees, currentBS, { setMutate }) => {
  currentBS.selectedUser = employees;
  setMutate((e) => !e);
};
const onSelectHashtag = (hashtags, currentBS, { setMutate }) => {
  currentBS.selectedHashtag = hashtags;
  setMutate((e) => !e);
};
const assignContentPost = (value, isAddSpace, currentBS) => {
  value = removeVietnameseTones(value);
  const contentPost = `${isAddSpace}@${value} `;
  const contentPostFormatted = `${isAddSpace}${KEY_START_TAG}${value}${KEY_END_TAG} `;
  currentBS.contentPost += contentPost;
  currentBS.contentPostFormatted += contentPostFormatted;
};
export const handleDisplayBS = (
  type,
  currentBS,
  listUser,
  { setVisibleOption, setVisibleBS }
) => {
  try {
    switch (type) {
      case POST_CREATION: // * Create
        currentBS.isPublicPost = true;
        currentBS.contentPost = "";
        currentBS.contentPostFormatted = "";
        currentBS.listUser = listUser;
        currentBS.selectedUser = [];
        currentBS.selectedHashtag = [];
        currentBS.selectedImage = [];
        currentBS.dialogTitle = "Tạo bài viết";
        let listHashtag = JSON.parse(listUser?.[0]?.tagList || "[]");
        currentBS.listHashtag = listHashtag;
        break;
      case POST_EDITION: // * Edit
        const { item } = currentBS;
        const feedData = JSON.parse(item?.feedData || "{}");
        currentBS.isPublicPost = item.feedType === PUBLIC;
        currentBS.listUser = listUser;
        // * Content
        let arrContent = (feedData?.content || "").split(" "),
          contentPost = "";
        for (let i = 0, lenContent = arrContent.length; i < lenContent; i++) {
          if (
            arrContent[i]?.startsWith(KEY_START_TAG) ||
            arrContent[i]?.endsWith(KEY_END_TAG)
          ) {
            contentPost +=
              "@" +
              arrContent[i]?.slice(
                KEY_START_TAG.length,
                arrContent[i]?.lastIndexOf(KEY_END_TAG)
              );
          } else {
            contentPost += arrContent[i];
          }
          contentPost += i === lenContent - 1 ? "" : " ";
        }
        currentBS.contentPost = contentPost;
        currentBS.contentPostFormatted = feedData.content || "";
        // * Selected User
        let arrViewer =
          item?.viewList !== "" && item?.viewList !== null
            ? item?.viewList?.split(",")
            : [];
        let selectedUser = [];
        for (let i = 0, lenViewer = arrViewer.length; i < lenViewer; i++) {
          selectedUser.push(+arrViewer[i]);
        }
        currentBS.selectedUser = selectedUser;
        // * Selected Hashtag
        let arrHashtag =
          item?.hasTag !== "" && item?.hasTag !== null
            ? item?.hasTag?.split(",")
            : [];
        let selectedHashtag = [];
        for (let i = 0, lenHashtag = arrHashtag.length; i < lenHashtag; i++) {
          selectedHashtag.push(arrHashtag[i]);
        }
        currentBS.selectedHashtag = selectedHashtag;
        // * Selected Image
        let arrImage = feedData?.photoList || [],
          selectedImage = [];
        for (let i = 0, lenImage = arrImage.length; i < lenImage; i++) {
          selectedImage.push({
            uri: item.imagePath + arrImage[i]?.Photo,
            fileName: arrImage[i]?.Photo,
            imageBase64: "",
            isAlreadyExist: true,
          });
        }
        currentBS.selectedImage = selectedImage;
        // *
        currentBS.dialogTitle = "Chỉnh sửa bài viết";
        let tagList = JSON.parse(listUser?.[0]?.tagList || "[]");
        currentBS.listHashtag = tagList;
        setVisibleOption(false);
        break;
    }
    currentBS.type = type;
    currentBS.optionType = type;
    setTimeout(() => setVisibleBS(true), 300);
  } catch (e) {
    console.log(e);
  }
};
export const onUpdateDataFeed = (data, userInfo, status, isLike = false) => {
  const cloneItem = _.cloneDeep(data);

  const pushContent =
    (!isLike && status === stusLike) ||
    cloneItem.employeeId === userInfo.employeeId
      ? null
      : `Nhân viên ${cloneItem.employeeName}` +
        `${
          status === stusLike
            ? `${
                cloneItem.feedLike - 1 > 0
                  ? ` và ${cloneItem.feedLike - 1} người khác`
                  : ""
              }`
            : ""
        }` +
        ` vừa ${status} bài viết này`;

  cloneItem.feedComment = JSON.stringify(cloneItem.feedComment);
  cloneItem.likeList = JSON.stringify(cloneItem.likeList);
  cloneItem.followList = JSON.stringify(cloneItem.followList);
  cloneItem.feedMore = JSON.stringify(cloneItem.feedMore);
  const dataSubmit = {
    FeedKey: cloneItem.feedKey,
    FeedLike: cloneItem.feedLike,
    LikeList: cloneItem.likeList,
    FollowList: cloneItem.followList,
    FeedComment: cloneItem.feedComment,
    FeedMore: cloneItem.feedMore,
    shopName: cloneItem.shopName,
    rootTask: cloneItem.employeeId,
    pushContent: pushContent,
  };
  UpdateFeedList(dataSubmit);
};
const onFollowFeed = async (
  currentBS,
  userInfo,
  { setVisibleOption, showToast }
) => {
  try {
    const { id, feedData, hasTag, feedType, viewList, followList, isFollowed } =
      currentBS.item || {};
    let followers = followList?.split(",") || [];
    if (isFollowed) {
      const indexId = followers.findIndex(
        (e) => e == userInfo.employeeId?.toString()
      );
      if (indexId !== -1) {
        followers.splice(indexId, 1);
      }
    } else {
      followers.push(userInfo.employeeId?.toString() || "000000");
    }
    followers = [...new Set(followers)];
    const dataSubmit = {
      feedData: JSON.stringify({
        FeedData: feedData,
        HasTag: hasTag,
        FeedType: feedType,
        FollowList: followers.join(","),
        ViewList: viewList,
      }),
    };
    const result = await EditFeedInfo(id, dataSubmit);
    if (Object.keys(result).length > 0) {
      if (isFollowed) {
        showToast("Đã bỏ theo dõi bài viết này", "info");
      } else {
        showToast("Đã theo dõi bài viết này", "info");
      }
      currentBS.item.followList = followers.join(",");
      currentBS.item.isFollowed = !isFollowed;
    }
    setVisibleOption(false);
  } catch (e) {
    console.log(e);
  }
};
const onLikeFeed = (feed, userInfo, { setMutate }) => {
  try {
    let count;
    if (feed.likeList[userInfo.employeeId]) {
      count = -1;
      delete feed.likeList[userInfo.employeeId];
    } else {
      count = 1;
      feed.likeList[userInfo.employeeId] = true;
    }
    feed.feedLike += count;
    setMutate((e) => !e);
    onUpdateDataFeed(feed, userInfo, stusLike, count === 1);
  } catch (e) {
    console.log(e);
  }
};
const onLikeComment = (
  feed,
  childIndex,
  currentBS,
  userInfo,
  { setMutate }
) => {
  try {
    const comments = feed.feedComment;
    let count = 0;
    if (comments?.[childIndex]?.whoseLiked?.[userInfo.employeeId]) {
      count = -1;
      delete comments?.[childIndex]?.whoseLiked?.[userInfo.employeeId];
    } else {
      count = 1;
      comments[childIndex].whoseLiked[userInfo.employeeId] = true;
    }
    comments[childIndex].likes += count;
    feed.feedComment = comments;
    currentBS.comments = comments;
    setMutate((e) => !e);
    onUpdateDataFeed(feed, userInfo, stusLike, count === 1);
  } catch (e) {
    console.log(e);
  }
};
const onLikeReplyComment = (
  feed,
  childIndex,
  subChildIndex,
  currentBS,
  userInfo,
  { setMutate }
) => {
  try {
    const comments = feed.feedComment;
    const replyComments = comments[childIndex].replyComments;
    const replyCommentItem = replyComments?.[subChildIndex];
    let count = 0;
    if (replyCommentItem?.whoseLikedReply?.[userInfo.employeeId]) {
      count = -1;
      delete replyCommentItem?.whoseLikedReply?.[userInfo.employeeId];
    } else {
      count = 1;
      replyCommentItem.whoseLikedReply[userInfo.employeeId] = true;
    }
    replyComments[subChildIndex].likes += count;
    comments[childIndex].replyComments = replyComments;
    feed.feedComment = comments;
    currentBS.replyComments = replyComments;
    setMutate((e) => !e);
    onUpdateDataFeed(feed, userInfo, stusLike, count === 1);
  } catch (e) {
    console.log(e);
  }
};
const onComment = async (
  event,
  feed,
  inputValues,
  currentBS,
  userInfo,
  { setMutate }
) => {
  try {
    if (event.keyCode === 13) {
      // * ENTER
      if (!inputValues[COMMENT]) return;
      const { fileName, imageBase64, uri } = feed?.selectedImageComment || {};
      feed.feedComment.push({
        avatarUrl: feed.hostUrlProfile,
        employeeId: userInfo.employeeId,
        employeeName: userInfo.employeeName,
        comment: inputValues[COMMENT] || "",
        likes: 0,
        whoseLiked: {},
        replyComments: [],
        photo: fileName || "",
        rootPhoto: `/uploaded/${moment().format("YYYYMMDD")}/`,
        temp_image_base64: uri,
        createdAt: moment(),
      });
      feed.feedMore = { lastCommentIndex: feed.feedComment.length - 1 };
      feed.selectedImageComment = {};
      currentBS.comments = feed.feedComment;
      inputValues[COMMENT] = "";
      setMutate((e) => !e);
      const cloned_feed = _.cloneDeep(feed); // * Clone Feed
      delete cloned_feed?.feedComment?.[cloned_feed?.feedComment?.length - 1]
        ?.temp_image_base64;
      await onUpdateDataFeed(cloned_feed, userInfo, stusComment);
      if (fileName) {
        // * comment with image
        const dataUploadImage = {
          fileName: fileName || "",
          fileBase64: imageBase64 || "",
          photoDate: +moment().format("YYYYMMDD"),
        };
        await UploadPhotoFeed(dataUploadImage);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
const onReplyComment = async (
  event,
  feed,
  childIndex,
  inputValues,
  currentBS,
  userInfo,
  { setMutate }
) => {
  try {
    if (event.keyCode === 13) {
      // * ENTER
      if (!inputValues[childIndex]) return;
      const comments = feed.feedComment;
      const { fileName, imageBase64, uri } =
        comments?.[childIndex]?.selectedImageReplyComment || {};
      const replyComments = comments[childIndex].replyComments;
      replyComments.push({
        avatarUrl: feed.hostUrlProfile,
        employeeId: userInfo.employeeId,
        employeeName: userInfo.employeeName,
        likes: 0,
        whoseLikedReply: {},
        photo: fileName || "",
        rootPhoto: `/uploaded/${moment().format("YYYYMMDD")}/`,
        temp_image_base64: uri,
        replyComment: inputValues[childIndex],
        createdAt: moment(),
      });
      comments[childIndex].replyComments = replyComments;
      comments[childIndex].selectedImageReplyComment = {};
      feed.feedMore = {
        lastCommentIndex: childIndex,
        lastReplyCommentIndex: replyComments.length - 1,
      };
      feed.feedComment = comments;
      currentBS.replyComments = replyComments;
      inputValues[childIndex] = "";
      setMutate((e) => !e);
      const cloned_feed = _.cloneDeep(feed); // * Clone Feed
      delete cloned_feed?.feedComment?.[childIndex]?.replyComments?.[
        replyComments?.length - 1
      ]?.temp_image_base64;
      onUpdateDataFeed(cloned_feed, userInfo, stusComment);
      if (fileName) {
        // * comment with image
        const dataUploadImage = {
          fileName: fileName || "",
          fileBase64: imageBase64 || "",
          photoDate: +moment().format("YYYYMMDD"),
        };
        await UploadPhotoFeed(dataUploadImage);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
const onAppendTextInput = (
  feed,
  index,
  refReplyComments,
  additionalInput,
  { setMutate }
) => {
  additionalInput[index] = true;
  const keyRef = `${feed?.feedKey}${index}`;
  setTimeout(() => refReplyComments[keyRef]?.focus(), 300);
  setMutate((e) => !e);
};
const onChangeForm = (value, stateName, inputValues, { setMutate }) => {
  inputValues[stateName] = value;
  setMutate((e) => !e);
};
const onShareFeed = (feed, { showToast }) => {
  showToast("Pending", "warn");
};
export const SkeletonLoading = () => {
  return (
    <div
      style={{
        width: widthFeed,
        marginBottom: 10,
        background: "var(--surface-50)",
        borderRadius: 5,
      }}
    >
      <div className="p-d-flex p-mb-1" style={{ padding: 10 }}>
        <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
        <div>
          <Skeleton width="10rem" className="p-mb-2"></Skeleton>
          <Skeleton width="5rem" className="p-mb-2"></Skeleton>
          <Skeleton height=".5rem"></Skeleton>
        </div>
      </div>
      <Skeleton width="100%" height="250px"></Skeleton>
      <div className="p-d-flex p-jc-around p-mt-1" style={{ padding: 10 }}>
        <Skeleton width={"25%"} height="2rem"></Skeleton>
        <Skeleton width={"25%"} height="2rem"></Skeleton>
        <Skeleton width={"25%"} height="2rem"></Skeleton>
      </div>
    </div>
  );
};
const generateString = () => {
  return Math.random().toString(10).slice(2) + "_" + Date.now();
};
