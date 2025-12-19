package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Advocate struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	FirmName       string `json:"firm_name"`
	Address        string `json:"address"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	PlotNo         string `json:"plot_no"`
	EnrollmentDate string `json:"enrollment_date"`
	RenewalDate    string `json:"renewal_date"`
	CertificateNo  string `json:"certificate_no"`
	Status         string `json:"status"`
}

func main() {
	url := "https://www.judiciary.go.ug/print_all_advocates.php"

	outputFile := "advocates.json"

	// Make HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalf("Failed to fetch URL: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Fatalf("Status code error: %d %s", resp.StatusCode, resp.Status)
	}

	// Parse HTML
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		log.Fatalf("Failed to parse HTML: %v", err)
	}

	var advocates []Advocate

	// Find all table rows (skip header)
	doc.Find("table tr").Each(func(i int, row *goquery.Selection) {
		// Skip header row
		if row.Find("th").Length() > 0 {
			return
		}

		cols := row.Find("td")
		if cols.Length() >= 11 {
			advocate := Advocate{
				ID:             strings.TrimSpace(cols.Eq(0).Text()),
				Name:           strings.TrimSpace(cols.Eq(1).Text()),
				FirmName:       strings.TrimSpace(cols.Eq(2).Text()),
				Address:        strings.TrimSpace(cols.Eq(3).Text()),
				Email:          strings.TrimSpace(cols.Eq(4).Text()),
				Phone:          strings.TrimSpace(cols.Eq(5).Text()),
				PlotNo:         strings.TrimSpace(cols.Eq(6).Text()),
				EnrollmentDate: strings.TrimSpace(cols.Eq(7).Text()),
				RenewalDate:    strings.TrimSpace(cols.Eq(8).Text()),
				CertificateNo:  strings.TrimSpace(cols.Eq(9).Text()),
				Status:         strings.TrimSpace(cols.Eq(10).Text()),
			}
			advocates = append(advocates, advocate)
		}
	})

	// Convert to JSON
	jsonData, err := json.MarshalIndent(advocates, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal JSON: %v", err)
	}

	// Write to file
	err = os.WriteFile(outputFile, jsonData, 0o644)
	if err != nil {
		log.Fatalf("Failed to write file: %v", err)
	}

	fmt.Printf("Successfully wrote data to %s\n", outputFile)
}
