/**
 * Add a new node of type `addWhat` to DOM element `addTo`, returning the new element.
 * If the third argument is present, the new object is assigned that class.
 */
export function add(
  addTo: HTMLElement,
  addWhat: string,
  className?: string,
): HTMLElement {
  const res = document.createElement(addWhat);
  addTo.appendChild(res);
  if (className) res.setAttribute("class", className);
  return res;
}

const svgNS = "http://www.w3.org/2000/svg";

/**
 * Add a new SVG node of type `addWhat` to DOM element `addTo`, returning the new element.
 * If the third argument is present, the new object is assigned that class.
 */
export function addSVG(
  addTo: Element,
  addWhat: string,
  className?: string,
): SVGElement {
  const res = document.createElementNS(svgNS, addWhat);
  addTo.appendChild(res);
  if (className) res.setAttribute("class", className);
  return res;
}

/** Like `addSVG`, except it prepends the element. */
export function prependSVG(
  addTo: Element,
  addWhat: string,
  className?: string,
): SVGElement {
  const res = document.createElementNS(svgNS, addWhat);
  addTo.prepend(res);
  if (className) res.setAttribute("class", className);
  return res;
}

export function removeAllChildElements(box: HTMLElement): void {
  while (box.firstChild) {
    box.removeChild(box.firstChild);
  }
}

/**
 * Call a web service to get some JSON.
 * @param url - The URL to call.
 * @param success - A callback on success, taking the parsed JSON as argument.
 * @param failure - A callback on error, taking the error message as argument. Optional.
 * @param message - The message to send, in the case of POST. `null` or non-existent for GET.
 * @param contentType - Optional content type to send. Only meaningful for POST.
 * @param responseType - Optional response type to receive. Default is "json".
 */
export function getWebJSON(
  url: string,
  success: (response: any) => void,
  failure?: (statusText: string) => void,
  message?: string | null,
  contentType?: string | null,
  responseType?: XMLHttpRequestResponseType,
): void {
  const xhr = new XMLHttpRequest();
  xhr.open(message ? "POST" : "GET", url, true);
  xhr.responseType = responseType || "json";
  if (contentType) xhr.setRequestHeader("Content-Type", contentType);
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) success(xhr.response);
      else {
        if (failure) failure(xhr.statusText);
      }
    }
  };
  if (failure)
    xhr.onerror = function () {
      failure(xhr.statusText);
    };
  if (message) xhr.send(message);
  else xhr.send();
}

/**
 * Make a GET URL from a base (e.g., "foo") and some query data (e.g., `{ bar: 42 }`).
 * The example would return "foo?bar=42".
 */
export function getURL(
  urlBase: string,
  queryData: { [key: string]: any },
): string {
  let res = urlBase;
  let sep = "?";
  for (const key in queryData) {
    if (queryData.hasOwnProperty(key)) {
      res +=
        sep +
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(queryData[key]);
      sep = "&";
    }
  }
  return res;
}
