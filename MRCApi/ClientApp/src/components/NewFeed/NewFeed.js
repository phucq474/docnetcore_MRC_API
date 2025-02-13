import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  removeVietnameseTones,
  getEmployeeId,
  getUrlParams,
} from "../../Utils/Helpler";
import {
  GetFeedList,
  GetUserShare,
  CreateFeed,
  UploadPhotoFeed,
  EditFeedInfo,
} from "../../store/NewFeedController";
import {
  ImageViewer,
  RenderFeedDetail,
  RenderDialogOption,
  handleDisplayBS,
  RenderComments,
  RenderDialogPrimary,
  SkeletonLoading,
} from "./FeedHelper";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import DEFAULT_AVATAR from "../../asset/images/empty_avatar.png";
import ERROR_AVATAR from "../../asset/images/error_avatar.jpg";
import _ from "lodash";
import moment from "moment";

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const HASHTAG = "HASHTAG";
const USERTAG = "USERTAG";
const POST_EDITION = "POST_EDITION";
const POST_CREATION = "POST_CREATION";
const widthFeed = 600;

const NewFeed = ({}) => {
  const [data, setData] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [hostUrlProfile, setHostUrlProfile] = useState("");
  const [objectUser, setObjectUser] = useState({});
  const [visibleBS, setVisibleBS] = useState(false);
  const [visibleImageViewer, setVisibleImageViewer] = useState(false);
  const [visibleOption, setVisibleOption] = useState(false);
  const [currentBS, setCurrentBS] = useState({});
  const [calledEffect, setCalledEffect] = useState(false);
  const [_, setMutate] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [additionalInput, set_] = useState({});
  const [refReplyComments, set__] = useState({});
  const [inputValues, set___] = useState({});
  const refComment = useRef(null);
  const refContentPost = useRef(null);
  const refTypeImage = useRef(null);
  const refTypeImageComment = useRef(null);
  const refTypeImageReplyComment = useRef(null);
  const refToast = useRef(null);

  const showToast = (message, style = "success") => {
    refToast?.current?.show({
      severity: style,
      summary: "Thông báo",
      detail: message,
    });
  };
  useEffect(() => {
    if (!calledEffect) {
      loadItem();
      loadUserShare();
    } else {
      setCalledEffect(true);
    }
    // * Get User Info
    let infoUser = localStorage.getItem("USER");
    if (infoUser !== null) {
      infoUser = JSON.parse(infoUser) || {};
      infoUser.employeeId = infoUser.id;
      infoUser.employeeName = infoUser.fullName;
      setUserInfo(infoUser);
    }
  }, []);
  const loadItem = async () => {
    setIsLoading(true);
    try {
      const querySearch = getUrlParams("q");
      setSearchInput(querySearch || "");
      const searchData = {};
      if (querySearch) {
        searchData.searchFeed = decodeURI(querySearch);
      }
      const result = await GetFeedList(searchData);
      const employeeId = getEmployeeId();
      for (let i = 0, lenResult = result.length; i < lenResult; i++) {
        result[i].feedComment = JSON.parse(result[i]?.feedComment || "[]");
        result[i].likeList = JSON.parse(result[i]?.likeList || "{}");
        result[i].feedMore = JSON.parse(result[i]?.feedMore || "{}");
        result[i].isFollowed = result[i]?.followList.indexOf(employeeId) !== -1;
      }
      setData(JSON.parse(JSON.stringify(result)));
      setHostUrlProfile(result?.[0]?.hostUrlProfile || DEFAULT_AVATAR);
    } catch (e) {
      console.log(e);
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
  const handleCreatePost = async () => {
    if (!currentBS.contentPostFormatted) return;
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
      const feedData = {
        content: contentPostFormatted,
        photoList: selectedImage.map((e) => ({ Photo: e.fileName })),
      };
      const viewList = isPublicPost
        ? listUser.map((e) => e.employeeId).join(",")
        : selectedUser.join(",");
      const dataCreate = {
        feedData: JSON.stringify({
          FeedData: JSON.stringify(feedData),
          HasTag: selectedHashtag.join(","),
          FollowList: `${userInfo.employeeId?.toString()},${viewList}`,
          ViewList: viewList,
          FeedType: isPublicPost ? "PUBLIC" : "PRIVATE",
        }),
        employeeName: userInfo.employeeName,
      };
      for (let i = 0, lenImages = selectedImage.length; i < lenImages; i++) {
        const dataImage = {
          fileName: selectedImage?.[i]?.fileName,
          fileBase64: selectedImage?.[i]?.imageBase64,
          photoDate: +moment().format("YYYYMMDD"),
        };
        await UploadPhotoFeed(dataImage);
      }
      const result = await CreateFeed(dataCreate);
      if (Object.keys(result).length > 0) {
        showToast("Tạo bài viết thành công", "info");
        setCurrentBS({});
        setVisibleBS(false);
        appendItem(result);
      } else {
        showToast("Tạo bài viết thất bại", "error");
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };
  const handleUpdatePost = async () => {
    setIsLoading(true);
    try {
      const {
        index,
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
        assignItem(index, result);
      } else {
        showToast("Chỉnh sửa bài viết thất bại", "error");
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };
  const assignItem = (index, item) => {
    data[index].hasTag = item.hasTag;
    data[index].feedType = item.feedType;
    data[index].feedData = item.feedData;
    data[index].followList = item.followList;
    data[index].viewList = item.viewList;
    setMutate((e) => !e);
  };
  const appendItem = (item) => {
    item.feedComment = JSON.parse(item?.feedComment || "[]");
    item.likeList = JSON.parse(item?.likeList || "{}");
    item.feedMore = JSON.parse(item?.feedMore || "{}");
    item.isFollowed = item?.followList.indexOf(userInfo.employeeId) !== -1;
    data.unshift(item);
    setMutate((e) => !e);
  };
  const onSearchFeed = (event) => {
    if (event.keyCode === 13) {
      setSearchInput("");
      window.open(`/newfeed?q=${encodeURI(searchInput)}`);
    }
  };
  const onGoToFeedDetail = (feed) => {
    window.open(`/newfeed/feed/${feed.feedKey}`);
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
    return currentBS.optionType === POST_CREATION ? (
      <div>
        <Button
          label="Huỷ"
          className="p-button-outlined p-button-danger btn__hover"
          onClick={() => setVisibleBS(false)}
        />
        <Button
          label="Tạo"
          className="p-button-outlined p-button-success btn__hover"
          onClick={handleCreatePost}
        />
      </div>
    ) : currentBS.optionType === POST_EDITION ? (
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
      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!isLoading && (
          <div
            style={{
              width: widthFeed,
              marginBottom: 10,
              background: "var(--surface-50)",
              padding: 10,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <i className="pi pi-search" style={{ fontSize: 20 }}></i>
            <InputText
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={onSearchFeed}
              placeholder={"Tìm kiếm theo nhân viên hoặc tag..."}
              style={{ marginLeft: 10 }}
            />
          </div>
        )}
        {!isLoading && (
          <div
            style={{
              width: widthFeed,
              cursor: "pointer",
              marginBottom: 10,
              background: "var(--surface-50)",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <div
              onClick={() =>
                handleDisplayBS(POST_CREATION, currentBS, listUser, {
                  setVisibleOption,
                  setVisibleBS,
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <img
                src={hostUrlProfile}
                alt=""
                onError={(e) => (e.target.src = ERROR_AVATAR)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <InputText
                placeholder={"Tạo bài viết..."}
                disabled
                style={{ marginLeft: 10 }}
              />
            </div>
          </div>
        )}
        {data.length > 0 ? (
          data.map((feed, index) => {
            return (
              <div
                key={index}
                style={{
                  width: widthFeed,
                  marginBottom: 10,
                  background: "var(--surface-50)",
                  borderRadius: 5,
                }}
              >
                <RenderFeedDetail
                  feed={feed}
                  index={index}
                  userInfo={userInfo}
                  currentBS={currentBS}
                  setMutate={setMutate}
                  setVisibleImageViewer={setVisibleImageViewer}
                  setVisibleOption={setVisibleOption}
                  onGoToFeedDetail={onGoToFeedDetail}
                  showToast={showToast}
                />
                {feed?.feedComment?.length > 0 && (
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
                )}
              </div>
            );
          })
        ) : (
          <SkeletonLoading />
        )}
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
    </React.Fragment>
  );
};
export default NewFeed;
