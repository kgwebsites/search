package dewey

import "regexp"

// Config contains Initial Configurations
var Config struct {
	SearchExp  *regexp.Regexp
	ExcludeExp *regexp.Regexp
	IncludeExp *regexp.Regexp
}
