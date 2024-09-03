import { gapi } from 'gapi-script';

const CLIENT_ID = '448304700198-6k64pjhumleghp23asohbdd1cuolbo91.apps.googleusercontent.com'; // Replace with your OAuth 2.0 Client ID
const API_KEY = 'AIzaSyA0s2Fc90ibzw9U-_sxWtwJYtxnB2I69IM'; // Replace with your API Key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.meet.readonly https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly';

export const initClient = () => {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
              authInstance.signIn().then(() => {
                resolve(authInstance);
              }).catch(err => reject(err));
            } else {
              resolve(authInstance);
            }
          }).catch((error) => {
          console.error('Error initializing Google API Client:', error);
          reject(error);
        });
      });
    });
  };

export const fetchDriveFiles=(folderId)=>{
  
    
    return gapi.client.drive.files.list({
        q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, webViewLink, thumbnailLink)',
    })
}
  
