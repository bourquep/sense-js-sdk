/*
sense-js-sdk
Copyright (C) 2025 Pascal Bourque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/** Error thrown when attempting to access the Sense API without proper authentication. */
export class UnauthenticatedError extends Error {
  /**
   * Creates a new UnauthenticatedError instance.
   *
   * @param message - The error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}

/** Error thrown when a Sense API request fails. */
export class SenseApiError extends Error {
  /** The HTTP status code returned by the API */
  readonly status: number;
  /** The HTTP status text returned by the API */
  readonly statusText: string;

  /**
   * Creates a new SenseApiError instance.
   *
   * @param apiResponse - The failed Response object from the API call
   */
  constructor(apiResponse: Response) {
    super(
      `Failed to call the '${apiResponse.url}' Sense API endpoint. The server responded with a status of ${apiResponse.status} (${apiResponse.statusText}).`
    );
    this.name = 'SenseApiError';
    this.status = apiResponse.status;
    this.statusText = apiResponse.statusText;
  }
}
