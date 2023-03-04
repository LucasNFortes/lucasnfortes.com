
/*Posts*/
class Postagem {
	constructor(titulo, conteudo, data, tags, imagem, destaque) {
		this.titulo = titulo;
		this.conteudo = conteudo;
		this.data = data;
		this.tags = Array.isArray(tags) ? tags : [tags];
		this.imagem = imagem;
		this.destaque = destaque;
		this.resumo = (conteudo.substring(0, 100) + '...');
    this.continuealer = 'Continue a ler »'
	}

	exibirResumo() {
		// criar elementos HTML para o resumo da postagem
		const postagemElement = document.createElement('div');
		const tituloElement = document.createElement('h3');
		const dataElement = document.createElement('h4');
    const imagemElement = document.createElement('img');
		const resumoElement = document.createElement('p');
    const tagsElement = document.createElement('ul');
    const continuealerElement = document.createElement('span');

		tituloElement.innerText = this.titulo;
    dataElement.innerText = this.data;
		imagemElement.src = this.destaque;
		resumoElement.innerText = this.resumo;
    continuealerElement.innerText = this.continuealer;

    // adicionar as tags
    for (let i = 0; i < this.tags.length; i++) {
      const tagElement = document.createElement('span');
      tagElement.innerText = this.tags[i];
      tagElement.classList.add('tag'); // adiciona a classe CSS "tag"
      tagElement.addEventListener('click', () => {
          window.location.href = `?tag=${this.tags[i]}`; // atualiza a URL com a tag clicada
      });
      tagsElement.appendChild(tagElement);
    }

		// adicionar o resumo da postagem à página
		postagemElement.appendChild(tituloElement);
		postagemElement.appendChild(dataElement);
		postagemElement.appendChild(imagemElement);
		postagemElement.appendChild(resumoElement);
    postagemElement.appendChild(continuealerElement);
    postagemElement.appendChild(tagsElement);

    // adicionar um evento de clique para abrir o conteúdo completo da postagem
		continuealerElement.addEventListener('click', () => {

			const conteudoElement = document.createElement('div');
			const conteudoCompleto = document.createElement('p');
			const imagemCompleta = document.createElement('img');
      const voltarBotao = document.createElement('button');

			conteudoCompleto.innerText = this.conteudo;
			imagemCompleta.src = this.imagem;
      voltarBotao.innerText = 'Voltar';
      
			conteudoElement.appendChild(conteudoCompleto);
			conteudoElement.appendChild(imagemCompleta);
      conteudoElement.appendChild(voltarBotao);

      // atualizar a página para exibir a div com o conteúdo completo
      const container = document.querySelector('#posts-container');
      container.innerHTML = '';
      container.appendChild(conteudoElement);

      //adicionar evento de clique para o botão Voltar
      voltarBotao.addEventListener('click', () => {
        window.location.reload();
      });

		});

		return postagemElement;
	}
}
// carregar os dados do arquivo JSON
fetch('./posts.json')
  .then(response => response.json())
  .then(posts => {
    // criar uma instância do construtor de postagens para cada postagem
    const postagens = posts.map(post => {
      return new Postagem(
        post.titulo,
        post.conteudo,
        post.data,
        post.tags,
        post.imagem,
        post.destaque,
        post.resumo
      );
    });

    // adicionar o resumo de cada postagem à página
    const postsContainer = document.querySelector('#posts-container');
    postagens.forEach(post => {
      postsContainer.appendChild(post.exibirResumo());
    });

    // criar uma lista de tags únicas presentes em todas as postagens
    const tagList = [...new Set(posts.flatMap(post => post.tags))];

    // criar elementos HTML para a lista de tags
    const tagListElement = document.createElement('ul');
    tagList.forEach(tag => {
      const tagElement = document.createElement('li');
      tagElement.innerText = tag;

      // adicionar um evento de clique para atualizar a página com os posts que possuem a tag selecionada
      tagElement.addEventListener('click', () => {
        // filtrar as postagens que possuem a tag selecionada
        const filteredPosts = posts.filter(post => post.tags.includes(tag));

        // criar uma instância do construtor de postagens para cada postagem filtrada
        const filteredPostagens = filteredPosts.map(post => {
          return new Postagem(
            post.titulo,
            post.conteudo,
            post.data,
            post.tags,
            post.imagem,
            post.destaque,
            post.resumo
          );
        });

        // atualizar a página com as postagens filtradas
        postsContainer.innerHTML = '';
        filteredPostagens.forEach(post => {
          postsContainer.appendChild(post.exibirResumo());
        });
      });

      tagListElement.appendChild(tagElement);
    });

    // adicionar a lista de tags à página
    const tagsContainer = document.querySelector('#tags-container');
    tagsContainer.appendChild(tagListElement);
  });