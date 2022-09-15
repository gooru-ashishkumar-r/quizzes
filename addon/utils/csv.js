import Ember from 'ember';
import PapaParse from 'papaparse';

/**
 * Downloads csv content
 * @see http://code.ciphertrick.com/2014/12/07/download-json-data-in-csv-format-cross-browser-support/
 * @see http://papaparse.com/docs#json-to-csv
 * @param {string} fileName
 * @param { { fields: [], data: [] } } data following the papaparse format
 *
 *   var csv = Papa.unparse({
 *     fields: ["Column 1", "Column 2"],
 *     data: [
 *      ["foo", "bar"],
 *      ["abc", "def"]
 *     ]
 *   });
 *
 *
 */
export function download(fileName, data) {
  const csv = PapaParse.unparse(data);
  var ua = window.navigator.userAgent;
  const isInternetExplorer =
    ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./); // If Internet Explorer, return true

  if (isInternetExplorer) {
    var IEwindow = window.open();
    IEwindow.document.write(`sep=,\r\n${data}`);
    IEwindow.document.close();
    IEwindow.document.execCommand('SaveAs', true, `${fileName}.csv`);
    IEwindow.close();
  } else {
    const uri = `data:application/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    const $container = Ember.$('body');

    $container.append(
      `<a id="gru-cvs-download" href="${uri}" download="${fileName}.csv" style="visibility:hidden">Download</a>`
    );
    const $link = $container.find('#gru-cvs-download');
    $link[0].click();
    $link.remove();
  }
}
