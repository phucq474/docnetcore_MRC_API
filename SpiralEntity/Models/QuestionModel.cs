using System.Collections.Generic;

namespace SpiralEntity.Models
{
    public class QuestionModel
    {
        public int? indexRow { get; set; }
        public int? questionId { get; set; }
        public string questionName { get; set; }
        public int? questionType { get; set; }
        public bool? required { get; set; }
        public string min { get; set; }
        public string max { get; set; }
        public bool? isEnd { get; set; }
        public List<ImageModel> images { get; set; }
        public List<AnswerModel> anwserItem { get; set; }
    }
}