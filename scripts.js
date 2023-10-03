const url = "https://jsonplaceholder.typicode.com/posts"; //importa a API atribuindo o conteúdo na const url
//cria uma constante para atribuir o conteúdo a cada objeto, chamando a div que vai exibir pelo id
const postsContainer = document.querySelector('#posts-container'); 
const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#post-container');
const commentsContainer = document.querySelector('#comments-container');
const commentForm = document.querySelector('#comment-form');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');
//Load post
const urlSearchParams = new URLSearchParams(window.location.search); //estudar new e URLSearchParams
const postId = urlSearchParams.get("id");
//Get all posts
//função assíncrona pq vai disparar a fetch na API somente depois de um evento
async function getAllPosts(){
    //await pq é função async, então espera o evento para o disparo
    const response = await fetch(url);
    //transforma os dados de resposta da API em json
    const data = await response.json();
    //loadingElement.classList.add("hide");
    //data.map vai mapear o json, trazer todos os elementos, permitir modificar e incluir elementos na pag
    data.map((post) => {
        //cria uma constante para atribuir o conteúdo a cada objeto que está sendo criado
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");
        //usa das const para atribuir valor de texto e atributo
        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);
        //title, body e link são childs de div e div child de postsContainer
        //seta a hierarquia dos objetos
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        postsContainer.appendChild(div);
        console.log(response)
    });

}

// Get individual post
async function getPost(id) {
    //cria um array com responsePost e responseComments para atribuir response dos posts e comentários
    //promise.all pq vai devolver os resultados em uma promise de todos os conteúdos resultantes do fetch
    const [responsePost, responseComments] = await Promise.all([
      fetch(`${url}/${id}`),
      fetch(`${url}/${id}/comments`),
    ]);
    //dataPost e dataComments pega as responses e transforma em json
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();
    /*loadingElement.classList.add("hide");
    postPage.classList.remove("hide");*/
    //cria elementos para receber título e corpo 
    const title = document.createElement("h1");
    const body = document.createElement("p");
    //atribui valor com .innerText
    title.innerText = dataPost.title;
    body.innerText = dataPost.body;
    //seta a hierarquia dos objetos
    postContainer.appendChild(title);
    postContainer.appendChild(body);
    //.map vai mapear o json, trazer todos os elementos, permitir modificar e incluir elementos na pag
    dataComments.map((comment) => {
      createComment(comment);
    });
  }
  
  function createComment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");
  
    email.innerText = comment.email;
    commentBody.innerText = comment.body;
  
    div.appendChild(email);
    div.appendChild(commentBody);
    commentsContainer.appendChild(div);
  }
  
  // Insert a comment
  //no fetch, o método muda para POST, pq está inserindo um comentário
  async function postComment(comment) {
    const response = await fetch(url, {
      method: "POST",
      body: comment,
      headers: {
        "Content-type": "application/json",
      },
    });
  
    const data = await response.json();
  
    createComment(data);
  }
  
  if (!postId) {
    getAllPosts();
  } else {
    getPost(postId);
  
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      let comment = {
        email: emailInput.value,
        body: bodyInput.value,
      };
  
      comment = JSON.stringify(comment);
  
      postComment(comment);
    });
  }






