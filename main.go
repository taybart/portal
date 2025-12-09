package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Client struct {
	model string
}

func newClient() *Client {
	return &Client{
		model: "qwen3:8b",
	}
}

type GenReq struct {
	Model  string `json:"model,omitempty"`
	Prompt string `json:"prompt,omitempty"`
	Stream bool   `json:"stream"`
	Think  bool   `json:"think"`
}
type GenRes struct {
	Model      string
	CreatedAt  string
	Response   string
	Done       bool
	DoneReason string
	Context    []int
}

func (c Client) generate(helpMsg string) error {

	b, err := json.Marshal(GenReq{
		Model: c.model,
		Prompt: fmt.Sprintf(`
			%%%%%%%%%%%%
			%s
			%%%%%%%%%%%%

			can you translate the above help message (everything inbetween the %%%%%%%%%%%% above into the following json format, don't add any formatting:
			[{
				"short": "what the shortend flag is if avalable",
				"long": "what the long flag is if available",
				"required": "boolean if the help message says its required",
				"help": "what the help message says",
				"example": "what the example is",
				"type": "what type the arg is if its obvious, otherwise make it a string"
			}]
			make sure to only output the original json that i outlined in the beginning and stop. so
			your output would just be the json blob and stop
			`, helpMsg),
		Stream: false,
		Think:  false,
	})
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", "https://llm.bbl.systems/api/generate", bytes.NewReader(b))
	if err != nil {
		return err
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}
	var genRes GenRes
	if err := json.Unmarshal(body, &genRes); err != nil {
		return err
	}
	fmt.Println(genRes.Response)

	return nil
}

func main() {
	client := newClient()
	if err := client.generate(`
		unix-timestamp:
    --diff, -d:
	print difference to now (ex. 3min from now/2 days ago)
    --timestamp, -ts:
	RFC3339 timestamp to convert to a unix timestamp
    --unix, -u:
	unix timestamp to convert
		`); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
