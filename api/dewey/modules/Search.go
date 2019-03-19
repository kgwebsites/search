package dewey

import (
	"bufio"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/iafan/cwalk"
)

var files Files
var searchResults SearchResults

// Res is the results from Search
type Res struct {
	Files         Files         `json:"files"`
	SearchResults SearchResults `json:"searchResults"`
}

// Search returns a slice of the files which meet the criteria
var Search = func(dir string) Res {

	visit := func(path string, f os.FileInfo, err error) error {
		if f.Size() < 1500000 {
			if Config.ExcludeExp.MatchString(path) {
				return filepath.SkipDir
			}
			if Config.IncludeExp.MatchString(path) {
				if Config.SearchExp.MatchString(f.Name()) {
					if len(files) < 2001 {
						files = append(files, File{Name: f.Name(), Path: path, RelPath: strings.TrimPrefix(path, dir)})
					}
				}

				if !f.IsDir() && f.Mode().IsRegular() {
					file, err := os.Open(path)
					if err != nil {
						log.Fatal(err)
					}
					defer file.Close()

					scanner := bufio.NewScanner(file)
					line := 1
					searchPath := SearchPath{
						Name:    f.Name(),
						Path:    path,
						RelPath: strings.TrimPrefix(path, dir),
						Results: []SearchResult{},
					}
					for scanner.Scan() {
						if len(searchResults) < 2001 {
							if Config.SearchExp.MatchString(scanner.Text()) {
								searchPath.Results = append(searchPath.Results, SearchResult{
									Line:   line,
									Result: Config.SearchExp.ReplaceAllString(scanner.Text(), `<mark>${0}</mark>`),
								})
							}
						}
						line++
					}
					if len(searchPath.Results) > 0 {
						searchResults = append(searchResults, searchPath)
					}
				}
			}
		}
		return nil
	}

	cwalk.Walk(dir, visit)

	res := Res{Files: files, SearchResults: searchResults}
	return res
}
