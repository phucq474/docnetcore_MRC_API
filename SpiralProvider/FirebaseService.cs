using Google.Apis.Auth.OAuth2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public class FirebaseService
    {
        private readonly string[] Scopes = { "https://www.googleapis.com/auth/firebase.messaging" };
        private readonly string _serviceAccountFilePath;

        public FirebaseService(string serviceAccountFilePath)
        {
            _serviceAccountFilePath = serviceAccountFilePath;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            GoogleCredential credential;

            // Load the service account key file
            using (var stream = new FileStream(_serviceAccountFilePath, FileMode.Open, FileAccess.Read))
            {
                // Create a GoogleCredential from the service account file
                credential = GoogleCredential.FromStream(stream).CreateScoped(Scopes);
            }

            // Request an access token
            var token = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();
            return token;
        }
    }
}
