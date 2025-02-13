import { getToken } from '../Utils/Helpler';

export const GetFeedList = async (dataSearch = {}) => {
    try {
        const requestInfo = {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                "indexFrom": 1,
                "indexTo": 100000,
            },
            body: JSON.stringify(dataSearch)
        }
        const response = await fetch("/feed/newfeed", requestInfo)
        const result = await response.json()
        return result || []
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const GetFeedDetail = async (FeedKey) => {
    try {
        const requestInfo = {
            method: "GET",
            headers: {
                'Authorization': getToken(),
                "FeedKey": FeedKey,
            },
        }
        const response = await fetch("/feed/feeddetail", requestInfo)
        const result = await response.json()
        return result[0] || {}
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const UpdateFeedList = async (data) => {
    try {
        const requestInfo = {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("/feed/feedcomment", requestInfo)
        const result = await response.json()
        return result || []
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const CreateFeed = async (data) => {
    try {
        const requestInfo = {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                "indexFrom": 1,
                "indexTo": 100000,
            },
            body: JSON.stringify(data)
        }
        const response = await fetch("/feed/createfeed", requestInfo)
        const result = await response.json()
        return result?.[0] || {}
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const EditFeedInfo = async (feedId, feedData) => {
    try {
        const requestInfo = {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                "feedId": feedId,
                "indexFrom": 1,
                "indexTo": 5,
            },
            body: JSON.stringify(feedData)
        }
        const response = await fetch("/feed/feedupdate", requestInfo)
        const result = await response.json()
        return result?.[0] || {}
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const GetUserShare = async () => {
    try {
        const requestInfo = {
            method: "GET",
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
        }
        const response = await fetch("/feed/usershare", requestInfo)
        const result = await response.json()
        return result || []
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}
export const UploadPhotoFeed = async (data) => {
    try {
        const requestInfo = {
            method: "POST",
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
        const response = await fetch("/feed/feedPhoto", requestInfo)
        const result = await response.json()
        return result || []
    } catch (err) {
        console.log(err, 'err')
        return [];
    }
}