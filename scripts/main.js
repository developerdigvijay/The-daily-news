/* --- scripts/main.js --- */

/**
 * MOCK DATA
 */

// Helper to generate simple colorful SVG placeholders
const getPlaceholder = (color, text) => {
    const encoded = btoa(`
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`);
    return `data:image/svg+xml;base64,${encoded}`;
};

const ARTICLES = [
    {
        id: "1",
        title: "The Future of AI: Beyond the Hype",
        excerpt: "As artificial intelligence permeates every industry, experts weigh in on the ethical implications and the road ahead for AGI development.",
        content: `
            <p>Artificial Intelligence has ceased to be a buzzword and has become a fundamental layer of modern technology. From generative models to autonomous agents, the pace of innovation is staggering.</p>
            <p>"We are at a tipping point," says Dr. Elena Rostova, a leading AI researcher. "The questions we face today are no longer just about capability, but about alignment and safety."</p>
            <p>This article explores the transformative potential of these technologies, looking beyond the initial hype cycle to identify long-term trends that will shape the next decade.</p>
        `,
        author: "Sarah Jenks",
        date: "Oct 24, 2023",
        category: "Technology",
        image: getPlaceholder('#2563eb', 'AI Future'),
        featured: true
    },
    {
        id: "2",
        title: "Sustainable Cities: Green Architecture on the Rise",
        excerpt: "Urban planners are turning to nature for solutions. Vertical forests and carbon-neutral skyscrapers are redefining skylines.",
        content: `
            <p>Concrete jungles are turning green. In major metropolises like Singapore, Milan, and New York, architects are integrating plant life directly into building facades.</p>
            <p>These "vertical forests" serve multiple purposes: they absorb CO2, lower urban temperatures, and provide psychological relief for residents.</p>
            <p>But the challenges are significant. Maintenance costs and structural requirements mean that green architecture is still a premium feature, though costs are falling rapidly.</p>
        `,
        author: "Michael Chen",
        date: "Oct 23, 2023",
        category: "Environment",
        image: getPlaceholder('#16a34a', 'Green Cities'),
        featured: true
    },
    {
        id: "3",
        title: "Mars Mission: The new race to the Red Planet",
        excerpt: "Space agencies and private companies accelerate their timelines for the first human landing on Mars.",
        content: `
            <p>The race to Mars has heated up again. With Starship orbital tests and NASA's Artemis program gaining momentum, humanity looks closer than ever to becoming an interplanetary species.</p>
            <p>However, the technical hurdles remain immense. Radiation shielding, life support, and the psychological toll of a 6-month journey are problems that still need robust solutions.</p>
        `,
        author: "Alex Rivera",
        date: "Oct 22, 2023",
        category: "Science",
        image: getPlaceholder('#dc2626', 'Mars Mission'),
        featured: false
    },
    {
        id: "4",
        title: "Culinary Revolution: Ancient Grains Make a Comeback",
        excerpt: "Chefs around the world are rediscovering ingredients that have been staples for millennia.",
        content: `
            <p>Quinoa was just the beginning. Now, teff, fonio, and amaranth are finding their way onto Michelin-starred menus.</p>
            <p>This shift isn't just about taste. It's about biodiversity and soil health. Monocultures of wheat and corn have depleted topsoil, and these resilient ancient grains offer a sustainable alternative.</p>
        `,
        author: "Julia Childers",
        date: "Oct 21, 2023",
        category: "Lifestyle",
        image: getPlaceholder('#d97706', 'Ancient Grains'),
        featured: false
    },
    {
        id: "5",
        title: "Digital Minimalism: Finding Peace in a Connected World",
        excerpt: "Why more people are switching to 'dumb phones' and limiting their screen time.",
        content: `
            <p>The notification fatigue is real. A growing movement of 'digital minimalists' is rejecting the constant connectivity of the smartphone era.</p>
            <p>Sales of feature phones are up 20% this year in some markets. People are craving disconnection to reconnect with reality.</p>
        `,
        author: "Tom Hiddleston",
        date: "Oct 20, 2023",
        category: "Health",
        image: getPlaceholder('#4b5563', 'Digital Minimalism'),
        featured: false
    },
    {
        id: "6",
        title: "The Economics of Streaming: Is the Bubble Bursting?",
        excerpt: "With rising prices and content fragmentation, consumers are rethinking their subscriptions.",
        content: `
            <p>The golden age of cheap streaming is over. As platforms consolidate and prices hike, piracy is seeing a resurgence.</p>
            <p>Analysts predict a 'Great Re-bundling' where services will aggregate again, looking suspiciously like the cable TV packages they arrived to replace.</p>
        `,
        author: "Emily Blunt",
        date: "Oct 19, 2023",
        category: "Business",
        image: getPlaceholder('#7c3aed', 'Streaming Wars'),
        featured: false
    }
];

let TRENDING_TOPICS = [
    { id: 1, title: "Global Market Rally", views: "1.2M" },
    { id: 2, title: "New EV Regulations", views: "900K" },
    { id: 3, title: "Championship Finals", views: "850K" },
    { id: 4, title: "Tech Giant Merger", views: "720K" },
    { id: 5, title: "Heatwave Warning", views: "500K" },
    { id: 6, title: "Oscar Nominations", views: "300K" }
];

/**
 * CORE FUNCTIONS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine page type
    const isHomePage = !!document.getElementById('home-page');
    const isArticlePage = !!document.getElementById('article-page');

    if (isHomePage) {
        initHomePage();
    } else if (isArticlePage) {
        initArticlePage();
    }

    // Shared functionality
    initSearch();
});

// state for filtering & pagination
let currentCategory = 'All';
let currentSearchQuery = '';
let currentPage = 1;
const PAGE_SIZE = 3;
let lastFiltered = ARTICLES;

function initHomePage() {
    renderFeatured();
    renderCategoryFilters(); // build filter buttons
    applyFilters(); // renders initial feed with pagination support
    initLoadMore();
    initTrending();
}



/**
 * ANIMATION / REVEAL LOGIC
 */
// Observer to trigger animations when elements scroll into view
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target); // Animate once
        }
    });
}, {
    rootMargin: '0px 0px -50px 0px', // Trigger slighly before bottom
    threshold: 0.1
});

function observeReveals() {
    document.querySelectorAll('.reveal-init').forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * HOMEPAGE LOGIC
 */

function renderFeatured() {
    const heroContainer = document.getElementById('hero-container');
    if (!heroContainer) return;

    // Pick the first featured article
    const heroArticle = ARTICLES.find(a => a.featured) || ARTICLES[0];

    // Add reveal-init class for animation
    heroContainer.innerHTML = `
        <div class="hero-card reveal-init" onclick="window.location.href='article.html?id=${heroArticle.id}'">
            <img src="${heroArticle.image}" alt="${heroArticle.title}" class="hero-image">
            <div class="hero-content">
                <span class="hero-tag">${heroArticle.category}</span>
                <h2 class="hero-title">${heroArticle.title}</h2>
                <div class="hero-meta">
                    By ${heroArticle.author} &bull; ${heroArticle.date}
                </div>
            </div>
        </div>
    `;

    // Start observing newly added elements
    observeReveals();
}

function renderFeed(articles) {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    // pagination slice
    const total = articles.length;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    const pageItems = articles.slice(0, end);

    if (pageItems.length === 0) {
        grid.innerHTML = `<div class="no-results reveal-init">No stories found matching your search.</div>`;
        observeReveals();
        toggleLoadMore(false, total);
        return;
    }

    grid.innerHTML = pageItems.map((article, index) => {
        return `
        <article class="article-card reveal-init" role="article" onclick="window.location.href='article.html?id=${article.id}'" tabindex="0">
            <div class="card-image-wrapper">
                <img src="${article.image}" alt="${article.title}" class="card-image" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-category">${article.category}</span>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-excerpt">${article.excerpt}</p>
                <footer class="card-footer">
                    <span>${article.author}</span>
                    <span>${article.date}</span>
                </footer>
            </div>
        </article>
    `}).join('');

    observeReveals();
    toggleLoadMore(end < total, total);
}


function initSearch() {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase();
        const isHomePage = !!document.getElementById('home-page');

        if (isHomePage) {
            applyFilters();
        } else if (e.target.value.length > 3 && e.key === 'Enter') {
            window.location.href = 'index.html';
        }
    });
}

// compute and render based on current filters/search
function applyFilters() {
    let result = ARTICLES;
    if (currentCategory && currentCategory !== 'All') {
        result = result.filter(a => a.category === currentCategory);
    }
    if (currentSearchQuery) {
        result = result.filter(a =>
            a.title.toLowerCase().includes(currentSearchQuery) ||
            a.excerpt.toLowerCase().includes(currentSearchQuery) ||
            a.category.toLowerCase().includes(currentSearchQuery)
        );
    }
    lastFiltered = result;
    currentPage = 1;
    renderFeed(lastFiltered);
}

function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;

    // gather unique categories
    const categories = Array.from(new Set(ARTICLES.map(a => a.category)));
    categories.sort();
    categories.unshift('All');

    container.innerHTML = categories.map(cat => {
        const activeClass = cat === currentCategory ? 'active' : '';
        return `<button class="filter-btn ${activeClass}" data-category="${cat}">${cat}</button>`;
    }).join(' ');

    // add event listeners
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            // update active state
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            applyFilters();
        });
    });
}


/**
 * TRENDING LOGIC
 */
function initLoadMore() {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        currentPage++;
        renderFeed(lastFiltered);
    });
}

function toggleLoadMore(show, total) {
    const container = document.getElementById('load-more-container');
    if (!container) return;
    container.style.display = show ? 'block' : 'none';
}

// Comments utilities
function getComments(articleId) {
    const key = `comments_${articleId}`;
    const raw = localStorage.getItem(key);
    try {
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn('Failed to parse comments', e);
        return [];
    }
}

function saveComments(articleId, comments) {
    const key = `comments_${articleId}`;
    localStorage.setItem(key, JSON.stringify(comments));
}

function renderCommentsSection(articleId) {
    const root = document.getElementById('comments-root');
    if (!root) return;
    const comments = getComments(articleId);

    const commentItems = comments.map(c => {
        return `
        <div class="comment">
            <div class="comment-meta"><strong>${c.author}</strong> • ${new Date(c.timestamp).toLocaleString()}</div>
            <div class="comment-text">${c.text}</div>
        </div>
        `;
    }).join('');

    root.innerHTML = `
        <h2>Comments</h2>
        <div class="comment-list">
            ${commentItems || '<p>No comments yet. Be the first to comment!</p>'}
        </div>
        <form id="comment-form" class="comment-form">
            <input type="text" id="comment-author" placeholder="Your name" required />
            <textarea id="comment-text" rows="3" placeholder="Write a comment..." required></textarea>
            <button type="submit">Post Comment</button>
        </form>
    `;

    // attach submit handler
    const form = document.getElementById('comment-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const authorInput = document.getElementById('comment-author');
        const textInput = document.getElementById('comment-text');
        const newComment = {
            author: authorInput.value.trim() || 'Anon',
            text: textInput.value.trim(),
            timestamp: Date.now()
        };
        if (!newComment.text) return; // nothing to add

        comments.push(newComment);
        saveComments(articleId, comments);
        // re-render comments list
        renderCommentsSection(articleId);
    });
}


function initTrending() {
    const container = document.getElementById('trending-list');
    if (!container) return;

    const renderItems = () => {
        return TRENDING_TOPICS.map((topic, index) => `
            <div class="trending-item">
                <div class="trending-rank">${index + 1}</div>
                <div class="trending-info">
                    <h4>${topic.title}</h4>
                    <div class="trending-meta">
                        <span class="refresh-dot" style="display:inline-block; width:6px; height:6px; background:var(--color-accent); border-radius:50%; margin-right:4px;"></span>
                        ${topic.views} reading now
                    </div>
                </div>
            </div>
        `).join('');
    };

    // Initial Render
    container.innerHTML = renderItems();

    // Auto-update with smooth transition
    setInterval(() => {
        // 1. Fade out
        container.classList.add('updating');

        // 2. Wait for fade out, then update data and DOM
        setTimeout(() => {
            // Mock data update
            updateTrendingData();

            // Update DOM
            container.innerHTML = renderItems();

            // 3. Fade in
            requestAnimationFrame(() => {
                container.classList.remove('updating');
            });
        }, 300); // Matches CSS transition duration

    }, 5000);
}

function updateTrendingData() {
    TRENDING_TOPICS.forEach(t => {
        let val = parseFloat(t.views);
        // Fluctuate
        if (Math.random() > 0.5) val += 0.1;
        else val = Math.max(0.1, val - 0.1);
        t.views = val.toFixed(1) + "M";
    });

    // Shuffle occasionally to show data change clearly
    if (Math.random() > 0.8) {
        TRENDING_TOPICS.sort(() => Math.random() - 0.5);
    }
}

/**
 * ARTICLE PAGE LOGIC
 */
function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('article-content');

    if (!id || !container) {
        if (container) container.innerHTML = "<p>Article not found.</p>";
        return;
    }

    const article = ARTICLES.find(a => a.id === id);
    if (!article) {
        container.innerHTML = "<div class='container'><br><h2>404 - Article Not Found</h2><p>The story you are looking for does not exist.</p><a href='index.html' class='back-link'>&larr; Back to Home</a></div>";
        return;
    }

    document.title = `${article.title} - The Daily News`;

    // Render Article
    container.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-cover">
        <div class="article-container">
            <a href="index.html" class="back-link">&larr; Back to Home</a>
            <header class="article-header">
                <span class="article-category">${article.category}</span>
                <h1 class="article-title-large">${article.title}</h1>
                <div class="article-meta-large">
                    By <strong>${article.author}</strong> | ${article.date}
                </div>
            </header>
            <div class="article-body">
                ${article.content}
            </div>
            <div id="comments-root" class="comments-section"></div>
        </div>
    `;

    // render comments after article content
    renderCommentsSection(article.id);

    // Note: CSS animations on .article-cover and .article-container 
    // handle the entrance automatically when inserted.
}
