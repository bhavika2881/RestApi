
# File Info Web application

This is a simple web application for uploading, searching, and managing files using HTML, Bootstrap, and JavaScript on the client side and Express.js on the server side. The application allows users to upload files, search for files by filename, and view a list of uploaded files along with their details.

Live Link : https://fileinfo.onrender.com/


## Features

- Upload Files: Users can upload files using the file input field and the "Upload" button.
- Search: Users can search for files by entering a filename and clicking the "Search" button.
- Search Result: Displays information about the searched file if found.
- Uploaded Files List: Shows a list of uploaded files along with their details and a "Delete" button to remove them.



## Tech Stack

**Client:** HTML, CSS, JavaScript

**Server:** 
- Express.js, Multer (for file upload)
- fs.promises (for filesystem operations)
- mime-types (for detecting file types)
- cors (for handling cross-origin requests)

## How to use

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Run the server using `node app.js`.
4. Open the localhost:5500.
## API Reference
#### Post file

```http
  POST /api/upload
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `upload` | `string` |  This will upload file.

#### Get all items

```http
  GET /api/files
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `files` | `string` |  This will return the list of all uploaded files.

#### Get item

```http
  GET /api/file/${filename}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `filename`      | `string` | Name of the file that user want to get. |

#### Delete file

```http
  DELETE /api/file/:filename
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `filename` | `string` |  This will delete file if it exists.



## Server API Endpoints

- `POST /upload`: Upload a file.
- `GET /files`: Get a list of all uploaded files.
- `GET /file/:filename`: Get information about a specific file.
- `DELETE /file/:filename`: Delete a specific file.
## Github Actions
The project includes a GitHub Actions workflow that automates the testing and deployment process. The pipeline is defined under section .github/workflows/main.yml file. It performs the following steps on every push to main branch :

- Checks the code and installl dependencies ans runs tests.
- On passing of tests, it builds a Docker image and publishes it to Docker Hub.



## Docker image

For running the docker image on your local systems, u need to first pull ur image from docker hub and then use below commands :

```bash
  docker pull bhavika2881/file:master
```

```bash
  docker run -p 5500:5500  bhavika2881/file:master
```
## Kubernetes Deployment and Service Configuration

For deploying the applicationin Kubernetescluster, you can use provided `deployment.yml` and `service.yml` files.

Following commands are used :
```bash
  minikube start
  ```
- For applying or updating Kubernetes resources that are defined in deployment.yml file.
```bash
  kubectl apply -f deployment.yml
```
- For applying or updating Kubernetes service that is defined in service.yml file.
```bash
  kubectl apply -f service.yml
```
- For getting information of fileapp-deployment 
```bash
  kubectl get deployment fileapp-deployment
```
- For listing the pod
```bash
  kubectl get pods -l app=fileapp
```
- for getting the logs
```bash
  kubectl logs {pod-name}
```
- For  retrieving the detailed information Kubernetes deployment named "fileapp-deployment"
```bash
  kubectl describe deployment fileapp-deployment
```
- For exposing the port 
```bash
  kubectl expose deployment nodeapp-deployment --type=LoadBalancer --port=5500
```
- For port forwarding 
```bash
 kubectl port-forward service/nodeapp-deployment 5500:5500
```




## Screenshots

[click here](https://drive.google.com/file/d/1LOHGmzjT55GzmKAaeBlkqXzldHJ5BULM/view?usp=sharing)

[click here](https://drive.google.com/file/d/1ECEAJ13jJjnbxeU7muhkFRgHCbz-Odgf/view?usp=sharing)

