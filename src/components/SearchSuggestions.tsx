import { Card } from "@/components/ui/card";
import SearchSuggestionItem from "./SearchSuggestionItem";

interface SearchSuggestionsProps {
	suggestions: string[];
	isVisible: boolean;
	onSuggestionClick: (suggestion: string) => void;
	onClose: () => void;
}

export default function SearchSuggestions({
	suggestions,
	isVisible,
	onSuggestionClick,
}: SearchSuggestionsProps) {
	if (!isVisible || suggestions.length === 0) {
		return null;
	}

	return (
		<Card className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-lg z-50 max-h-96 overflow-y-auto p-0 gap-0">
			{suggestions.map((suggestion, index) => (
				<SearchSuggestionItem
					key={index}
					suggestion={suggestion}
					onClick={onSuggestionClick}
				/>
			))}
		</Card>
	);
}
