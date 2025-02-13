namespace SpiralEntity.Models
{
    public class AlertModel
    {
        public AlertModel(int result, string imsg, string iError)
        {
            this.Result = result;
            this.Messenger = imsg;
            this.Error = iError;
        }

        public int Result { get; set; }
        public string Messenger { get; set; }
        public string Error { get; set; }
    }
}