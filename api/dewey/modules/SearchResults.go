package dewey

// SearchResult is 1 findings from a search path
type SearchResult struct {
	Line   int    `json:"line"`
	Result string `json:"result"`
}

// SearchPath Contains all search results for a single search result path
type SearchPath struct {
	Path    string `json:"path"`
	RelPath string `json:"relPath"`
	Name    string `json:"name"`
	Results []SearchResult
}

// SearchResults is a list of search path findings from a search
type SearchResults []SearchPath
