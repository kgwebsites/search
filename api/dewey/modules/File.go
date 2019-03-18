package dewey

// File contains a unique ID, a byte size, and the path where it came from
type File struct {
	Path    string `json:"path"`
	RelPath string `json:"relPath"`
	Name    string `json:"name"`
}

// Files contains a slice of File
type Files []File
