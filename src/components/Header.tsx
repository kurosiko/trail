export default function Header() {
	return (
		<header>
			<nav aria-label="navigaion bar">
				<a class="site-title" href="/" aria-label="Trail ホーム">
					<img class="site-logo" src="/trail-logo.svg" alt="Trail" />
				</a>
				<div class="nav-links">
					<a href="/about">About</a>
					<a href="/profile">Profile</a>
					<a href="/posts">Blog</a>
				</div>
			</nav>
		</header>
	);
}
