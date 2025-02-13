using System;
namespace MRCApi.ClientModel
{
    public class FeedCommentInfo
    {
        public string FeedKey { set; get; }
        public int FeedLike { set; get; }
        public int rootTask { set; get; }
        public string LikeList { set; get; }
        public string FeedMore { set; get; }
        public string FeedComment { set; get; }
        public string shopName { set; get; }
        public string pushContent { set; get; }
    }
}
