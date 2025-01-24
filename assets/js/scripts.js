// Add terminal timestamp
function updateTimestamp() {
    const timestamp = document.querySelector('.timestamp');
    const now = new Date();
    timestamp.textContent = `[${now.toISOString()}]`;
}

// Simulate terminal typing effect
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Update timestamp every second
setInterval(updateTimestamp, 1000);

// Configure marked options for better HTML rendering
marked.setOptions({
    headerIds: false,
    mangle: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: true
});

// Modify loadPost to include typing effect and handle markdown frontmatter
async function loadPost(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const content = document.getElementById('blog-content');
        content.innerHTML = '<div class="window-title">> OUTPUT_DISPLAY</div><div class="terminal-text"></div>';
        const contentText = content.querySelector('.terminal-text');
        
        // Add loading effect
        contentText.innerHTML = '[ ACCESSING CLASSIFIED DATA... ]\n\n';
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Parse frontmatter and content
        const [, frontmatter, ...contentParts] = text.split('---');
        const postContent = contentParts.join('---').trim();
        
        // Format frontmatter
        const metadata = frontmatter.trim().split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':').map(s => s.trim());
            acc[key] = value;
            return acc;
        }, {});
        
        // Create formatted HTML with proper spacing and structure
        const formattedContent = `
            <article class="post">
                <div class="post-header">
                    <h1>${metadata.title}</h1>
                    <div class="post-metadata">
                        <span>[CATEGORY: ${metadata.category}]</span>
                        <span>[DATE: ${metadata.date}]</span>
                    </div>
                </div>
                <div class="post-content">
                    ${marked.parse(postContent)}
                </div>
            </article>
        `;
        
        // Render content without typing effect for better HTML rendering
        contentText.innerHTML = formattedContent;

        // Add syntax highlighting for code blocks
        document.querySelectorAll('pre code').forEach(block => {
            block.innerHTML = block.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        });
    } catch (error) {
        console.error('Error loading post:', error);
    }
}

// Load blog posts and handle categories
async function loadBlogPosts() {
    try {
        const response = await fetch('./posts/posts.json');
        const data = await response.json();
        
        const categories = [...new Set(data.posts.map(post => post.category))];
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';

        categories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            // Create collapsible category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header clickable';
            categoryHeader.innerHTML = `
                <span class="category-toggle">[-]</span>
                <span class="category-name">[${category.toUpperCase()}]</span>
            `;
            
            const postsUl = document.createElement('ul');
            postsUl.className = 'category-posts';
            
            // Add click handler for category toggle
            categoryHeader.addEventListener('click', () => {
                postsUl.style.display = postsUl.style.display === 'none' ? 'block' : 'none';
                categoryHeader.querySelector('.category-toggle').textContent = 
                    postsUl.style.display === 'none' ? '[+]' : '[-]';
            });
            
            categorySection.appendChild(categoryHeader);
            categorySection.appendChild(postsUl);
            
            // Add posts for this category
            const categoryPosts = data.posts.filter(post => post.category === category);
            
            categoryPosts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="post-title">${post.title}</span>`;
                li.addEventListener('click', () => loadPost(`./posts/${post.file}`));
                postsUl.appendChild(li);
            });
            
            postsList.appendChild(categorySection);
        });

        // Load the first post by default
        if (data.posts.length > 0) {
            loadPost(`./posts/${data.posts[0].file}`);
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Load home content
function loadHome() {
    window.location.href = '/';
}

// Load about content
function loadAbout() {
    const content = document.getElementById('blog-content');
    content.innerHTML = `
        <div class="window-title">> OUTPUT_DISPLAY</div>
        <div class="terminal-text">
            <p>alpernae@localhost:/home/alpernae/about$ cat aboutme.txt</p>
            <br/>
            <p>
            Hello 👋 I'm Alperen, a student focused on application security and bug bounty hunting. 
            Currently, I'm working as a part-time bug bounty hunter trying to earn money, and I 
            aim to become a full-time bug bounty hunter in the future. 
            Besides these, I conduct security research by searching for vulnerabilities in open-source software.
            </p>
            <br/>
            <p>My Socials:</p>
            <ul>
                <li>X: <a href="https://twitter.com/alpernae" style="color: white">Twitter</a></li>
                <li>Instagram: <a href="https://instagram.com/alpernae" style="color: white">Instagram</a></li>
                <li>LinkedIn: <a href="https://linkedin.com/in/alpernae" style="color: white">LinkedIn</a></li>
                <li>H1: <a href="https://hackerone.com/alpernae" style="color: white">HackerOne</a></li>
                <li>Bugcrowd: <a href="https://bugcrowd.com/alpernae" style="color: white">Bugcrowd</a></li>
                <li>YWH: <a href="https://yeswehack.com/hunters/alpernae" style="color: white">YesWeHack</a></li>
                <li>Intigriti: <a href="https://intigriti.com/profile/alpernae" style="color: white">Intigriti</a></li>
            </ul>
        </div>
    `;
}

// Initialize
window.addEventListener('load', () => {
    loadBlogPosts();
    updateTimestamp();

    // Add menu event listeners
    document.getElementById('menu-home').addEventListener('click', loadHome);
    document.getElementById('menu-about').addEventListener('click', loadAbout);

    // Add cat animation and speech bubble
    const catAscii = document.querySelector('.ascii-art');
    const speechBubble = catAscii.querySelector('.speech-bubble');
    
    catAscii.addEventListener('click', () => {
        // Animation
        catAscii.classList.remove('jumping');
        void catAscii.offsetWidth;
        catAscii.classList.add('jumping');
        
        // Show speech bubble
        speechBubble.classList.add('show');
        
        // Hide speech bubble after 2 seconds
        setTimeout(() => {
            speechBubble.classList.remove('show');
        }, 2000);
    });
});
