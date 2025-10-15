# Pantalla Login
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Social Media Posts - Login</title>
<style>
 body {
   font-family: 'Poppins', sans-serif;
   background: linear-gradient(135deg, #dce3f0, #f8f9fb);
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100vh;
   margin: 0;
 }
 .login-container {
   background-color: white;
   padding: 2rem;
   border-radius: 1rem;
   box-shadow: 0 4px 20px rgba(0,0,0,0.1);
   text-align: center;
   width: 300px;
 }
 h1 {
   color: #3f72af;
   margin-bottom: 1rem;
 }
 input {
   width: 100%;
   padding: 0.8rem;
   margin: 0.5rem 0;
   border: 1px solid #ccc;
   border-radius: 0.5rem;
 }
 button {
   background-color: #3f72af;
   color: white;
   border: none;
   padding: 0.8rem;
   width: 100%;
   border-radius: 0.5rem;
   cursor: pointer;
   margin-top: 1rem;
 }
 button:hover {
   background-color: #2c5c9c;
 }
</style>
</head>
<body>
<div class="login-container">
 <h1>Social Media Posts</h1>
 <input type="text" placeholder="Usuario">
 <input type="password" placeholder="Contraseña">
 <button onclick="window.location.href='posts.html'">Entrar</button>
</div>
</body>
</html>
```
# Pantalla Post
```
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Media Posts</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #f4f7fc;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #3f72af;
      color: white;
      text-align: center;
      padding: 1rem;
    }
    .container {
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }
    textarea {
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid #ccc;
      padding: 1rem;
      resize: none;
    }
    button {
      background-color: #3f72af;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background-color: #2c5c9c;
    }
    .post {
      background: #f8f9fb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 1rem;
      border-left: 4px solid #3f72af;
    }
  </style>
</head>
<body>
  <header>
    <h1>Social Media Posts</h1>
  </header>
  <div class="container">
    <h2>Crear un nuevo post</h2>
    <textarea id="postContent" rows="3" placeholder="¿Qué estás pensando?"></textarea>
    <button onclick="addPost()">Publicar</button>

    <h2>Publicaciones</h2>
    <div id="posts"></div>
  </div>

  <script>
    function addPost() {
      const content = document.getElementById('postContent').value;
      if (content.trim() === '') return;
      const postsDiv = document.getElementById('posts');
      const post = document.createElement('div');
      post.classList.add('post');
      post.textContent = content;
      postsDiv.prepend(post);
      document.getElementById('postContent').value = '';
    }
  </script>
</body>
</html>
---
 
