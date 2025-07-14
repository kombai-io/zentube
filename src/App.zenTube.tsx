import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { store } from "./store";
import Layout from "./components/Layout";
import { VideoContainer } from "./components/VideoContainer";
import VideoPageWrapper from "./components/VideoPageWrapper";
import VideoLibraryPage from "./components/VideoLibraryPage";
import UserProfilePage from "./components/UserProfilePage";
import { DigitalWellbeingPage } from "./components/DigitalWellbeingPage";
import SearchResultsPage from "./components/SearchResultsPage";
import NotFound from "./components/NotFound";
import { Toaster } from "./components/ui/sonner";
import ThemeProvider from "./components/ThemeProvider";

function AppContent() {
	const navigate = useNavigate();

	const handleSearch = (query: string) => {
		if (query.trim()) {
			navigate(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Routes>
				<Route path="/" element={
					<Layout onSearch={handleSearch}>
						<VideoContainer regionCode="US" />
					</Layout>
				} />
				<Route path="/watch" element={
					<Layout onSearch={handleSearch}>
						<VideoPageWrapper />
					</Layout>
				} />
				<Route path="/search" element={
					<Layout onSearch={handleSearch}>
						<SearchResultsPage />
					</Layout>
				} />
				<Route path="/history" element={<VideoLibraryPage />} />
				<Route path="/watch-later" element={<VideoLibraryPage />} />
				<Route path="/liked-videos" element={<VideoLibraryPage />} />
				<Route path="/account" element={
					<Layout onSearch={handleSearch}>
						<UserProfilePage />
					</Layout>
				} />
				<Route path="/digital-wellbeing" element={
					<Layout onSearch={handleSearch}>
						<DigitalWellbeingPage />
					</Layout>
				} />
				<Route path="*" element={
					<Layout onSearch={handleSearch}>
						<NotFound />
					</Layout>
				} />
			</Routes>
			<Toaster />
		</div>
	);
}

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider>
				<BrowserRouter>
					<AppContent />
				</BrowserRouter>
			</ThemeProvider>
		</Provider>
	);
}


export default App;