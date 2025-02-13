import React, { useState, useEffect, useRef } from "react";
import { removeVietnameseTones, getEmployeeId } from "../../Utils/Helpler";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import {
  GetFeedDetail,
  GetUserShare,
  EditFeedInfo,
  UploadPhotoFeed,
} from "../../store/NewFeedController";
import {
  ImageViewer,
  RenderFeedDetail,
  RenderDialogOption,
  RenderComments,
  RenderDialogPrimary,
  SkeletonLoading,
} from "./FeedHelper";
import { ProgressSpinner } from "primereact/progressspinner";
import Page404 from "../ErrorRoute/Page404";
import DEFAULT_AVATAR from "../../asset/images/empty_avatar.png";
import _ from "lodash";
import moment from "moment";

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const HASHTAG = "HASHTAG";
const USERTAG = "USERTAG";
const POST_EDITION = "POST_EDITION";
const POST_CREATION = "POST_CREATION";
const widthFeed = 600;

const FeedDetail = ({ match }) => {
  const [feed, setFeed] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [listUser, setListUser] = useState([]);
  const [objectUser, setObjectUser] = useState({});
  const [hostUrlProfile, setHostUrlProfile] = useState("");
  const [inputValues, set___] = useState({});
  const [visibleBS, setVisibleBS] = useState(false);
  const [currentBS, setCurrentBS] = useState({});
  const [additionalInput, set_] = useState({});
  const [visibleImageViewer, setVisibleImageViewer] = useState(false);
  const [visibleOption, setVisibleOption] = useState(false);
  const [showPage404, setShowPage404] = useState(null);
  const [_, setMutate] = useState(false);
  const [refReplyComments, set__] = useState({});
  const refComment = useRef(null);
  const refToast = useRef(null);
  const refContentPost = useRef(null);
  const refTypeImage = useRef(null);
  const refTypeImageComment = useRef(null);
  const refTypeImageReplyComment = useRef(null);

  const showToast = (message, style = "success") => {
    refToast?.current?.show({
      severity: style,
      summary: "Thông báo",
      detail: message,
    });
  };
  useEffect(() => {
    calledEffect();
    loadUserShare();
    // * Get User Info
    let infoUser = localStorage.getItem("USER");
    if (infoUser !== null) {
      infoUser = JSON.parse(infoUser) || {};
      infoUser.employeeId = infoUser.id;
      infoUser.employeeName = infoUser.fullName;
      setUserInfo(infoUser);
    }
  }, []);
  const calledEffect = async () => {
    setIsLoading(true);
    const result = await GetFeedDetail(match?.params?.feedKey || "");
    if (result.id !== undefined) {
      const employeeId = getEmployeeId();
      result.feedComment = JSON.parse(result?.feedComment || "[]");
      result.likeList = JSON.parse(result?.likeList || "{}");
      result.feedMore = JSON.parse(result?.feedMore || "{}");
      result.isFollowed = result?.followList?.indexOf(employeeId) !== -1;
      setFeed(result || {});
      setHostUrlProfile(result?.hostUrlProfile || DEFAULT_AVATAR);
      setShowPage404(false);
    } else {
      setShowPage404(true);
    }
    setIsLoading(false);
  };
  const loadUserShare = async () => {
    const listUser = await GetUserShare();
    const objUser = {};
    for (let i = 0, lenListUser = listUser.length; i < lenListUser; i++) {
      objUser[
        removeVietnameseTones(listUser[i]?.employeeName?.split(" ")?.join(""))
      ] = true;
    }
    setObjectUser(objUser);
    setListUser(listUser || []);
  };
  const handleUpdatePost = async () => {
    setIsLoading(true);
    try {
      const {
        isPublicPost,
        listUser,
        selectedUser,
        selectedHashtag,
        selectedImage,
        contentPostFormatted,
      } = currentBS;
      const { id, followList, createDate } = currentBS.item || {};
      const feedData = {
        content: contentPostFormatted,
        photoList: selectedImage.map((e) => ({ Photo: e.fileName })),
      };
      const dataSubmit = {
        feedData: JSON.stringify({
          FeedData: JSON.stringify(feedData),
          HasTag: selectedHashtag.join(","),
          FollowList: followList,
          ViewList: isPublicPost
            ? listUser.map((e) => e.employeeId).join(",")
            : selectedUser.join(","),
          FeedType: isPublicPost ? "PUBLIC" : "PRIVATE",
        }),
      };
      for (let i = 0, lenImages = selectedImage.length; i < lenImages; i++) {
        if (selectedImage?.[i]?.isAlreadyExist) continue; // * Existed in cloud
        const dataImage = {
          fileName: selectedImage?.[i]?.fileName,
          fileBase64: selectedImage?.[i]?.imageBase64,
          photoDate: +moment(createDate).format("YYYYMMDD"),
        };
        await UploadPhotoFeed(dataImage);
      }
      const result = await EditFeedInfo(id, dataSubmit);
      if (Object.keys(result).length > 0) {
        showToast("Chỉnh sửa bài viết thành công", "info");
        setCurrentBS({});
        setVisibleBS(false);
        calledEffect();
      } else {
        showToast("Chỉnh sửa bài viết thất bại", "error");
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };
  const onFocusInputComment = () => {
    refComment?.current?.focus();
  };
  const handleJumpModal = (optionType) => {
    currentBS.optionType = optionType;
    switch (optionType) {
      case POST_CREATION:
        currentBS.dialogTitle = "Tạo bài viết";
        setTimeout(() => refContentPost?.current?.focus(), 300);
        break;
      case POST_EDITION:
        currentBS.dialogTitle = "Chỉnh sửa bài viết";
        break;
      case PUBLIC:
        currentBS.dialogTitle = "Chỉnh sửa dối tượng";
        break;
      case HASHTAG:
        currentBS.dialogTitle = "Chỉnh sửa hashtag cho bài viết";
      case USERTAG:
        currentBS.dialogTitle = "Chọn nhân viên để tag";
        break;
    }
    setMutate((e) => !e);
  };
  const renderFooterAction = () => {
    return currentBS.optionType === POST_EDITION ? (
      <div>
        <Button
          label="Huỷ"
          className="p-button-outlined p-button-danger btn__hover"
          onClick={() => setVisibleBS(false)}
        />
        <Button
          label="Lưu"
          className="p-button-outlined p-button-success btn__hover"
          onClick={handleUpdatePost}
        />
      </div>
    ) : currentBS.optionType === PUBLIC || currentBS.optionType === HASHTAG ? (
      <Button
        onClick={() => handleJumpModal(POST_CREATION)}
        icon="pi pi-arrow-left"
        className="p-button-outlined p-button-rounded p-button-secondary btn__hover"
        style={{ width: 35, height: 35 }}
      />
    ) : currentBS.optionType === PRIVATE ? (
      <Button
        onClick={() => handleJumpModal(PUBLIC)}
        icon="pi pi-arrow-left"
        className="p-button-outlined p-button-rounded p-button-secondary btn__hover"
        style={{ width: 35, height: 35 }}
      />
    ) : (
      currentBS.optionType === USERTAG && (
        <Button
          onClick={() => handleJumpModal(POST_CREATION)}
          icon="pi pi-arrow-left"
          className="p-button-outlined p-button-rounded p-button-secondary btn__hover"
          style={{ width: 35, height: 35 }}
        />
      )
    );
  };
  return (
    <React.Fragment>
      <Toast ref={refToast} />
      {isLoading && (
        <div className="loading_container">
          <ProgressSpinner
            className="loading_spinner"
            strokeWidth="8"
            fill="none"
            animationDuration=".5s"
          />
        </div>
      )}
      {showPage404 === null ? (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SkeletonLoading />
        </div>
      ) : showPage404 === false && !isLoading ? (
        <div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: widthFeed,
                marginBottom: 5,
                background: "var(--surface-50)",
                borderRadius: 5,
              }}
            >
              <RenderFeedDetail
                feed={feed}
                index={0}
                userInfo={userInfo}
                currentBS={currentBS}
                setMutate={setMutate}
                setVisibleImageViewer={setVisibleImageViewer}
                setVisibleOption={setVisibleOption}
                onGoToFeedDetail={onFocusInputComment}
                showToast={showToast}
              />
              <RenderComments
                feed={feed}
                refComment={refComment}
                refReplyComments={refReplyComments}
                refTypeImageComment={refTypeImageComment}
                refTypeImageReplyComment={refTypeImageReplyComment}
                setVisibleImageViewer={setVisibleImageViewer}
                currentBS={currentBS}
                setMutate={setMutate}
                userInfo={userInfo}
                inputValues={inputValues}
                additionalInput={additionalInput}
                hostUrlProfile={hostUrlProfile}
              />
            </div>
          </div>
          <RenderDialogPrimary
            visibleBS={visibleBS}
            currentBS={currentBS}
            userInfo={userInfo}
            objectUser={objectUser}
            setMutate={setMutate}
            hostUrlProfile={hostUrlProfile}
            setVisibleBS={setVisibleBS}
            handleJumpModal={handleJumpModal}
            refContentPost={refContentPost}
            refTypeImage={refTypeImage}
            renderFooterAction={renderFooterAction}
          />
          <RenderDialogOption
            userInfo={userInfo}
            currentBS={currentBS}
            listUser={listUser}
            visibleOption={visibleOption}
            setVisibleBS={setVisibleBS}
            setVisibleOption={setVisibleOption}
            showToast={showToast}
          />
          <ImageViewer
            currentBS={currentBS}
            setMutate={setMutate}
            visibleImageViewer={visibleImageViewer}
            setVisibleImageViewer={setVisibleImageViewer}
          />
        </div>
      ) : (
        !isLoading && (
          <Page404 /> // * Post Does Not Existed
        )
      )}
    </React.Fragment>
  );
};
export default FeedDetail;
