using System.Collections.Generic;

namespace SpiralEntity.Models
{
    public class AnswerModel
    {
        public int? id { get; set; }
        public string anwserName { get; set; }
        public int? anwserType { get; set; }
        public string anwserValue { get; set; }
        public string ortherValue { get; set; }
        public string min { get; set; }
        public string max { get; set; }
        public int? nextStep { get; set; }
        public string stepName { get; set; }
        public string[] dropdown { get; set; }
        public List<ImageModel> images { get; set; }
    }
}