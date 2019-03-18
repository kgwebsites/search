package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"regexp"

	dewey "github.com/kgwebsites/dewey/app/api/dewey/modules"
)

var api string
var dir string

var search string
var exclude string
var include string

func init() {
	flag.StringVar(&api, "api", "", "Which API function to call")
	flag.StringVar(&dir, "dir", "", "The directory to search for files.")
	flag.StringVar(&exclude, "exclude", "a^", "Regex string of path keywords to exclude. Defaults to nothing.")
	flag.StringVar(&include, "include", ".*", "Regex string of path keywords to include. Defaults to everything.")
	flag.StringVar(&search, "search", "", "Search value. Required if api is search. ")
}

func main() {
	flag.Parse()

	if api == "search" {
		if search == "" {
			log.Fatal("search parameter required for search api")
		}
		dewey.Config.SearchExp = regexp.MustCompile(search)
		dewey.Config.ExcludeExp = regexp.MustCompile(exclude)
		dewey.Config.IncludeExp = regexp.MustCompile(include)

		results := dewey.Search(dir)
		data, _ := json.Marshal(results)
		fmt.Print(string(data))
	}
}
