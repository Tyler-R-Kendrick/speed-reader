import { OdtParser } from './content-parser';
import JSZip from 'jszip';

describe('OdtParser', () => {
  it('extracts text from odt', async () => {
    const zip = new JSZip();
    zip.file(
      'content.xml',
      '<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"><office:body><office:text><text:p>Hello Odt</text:p></office:text></office:body></office:document-content>'
    );
    const buffer = await zip.generateAsync({ type: 'arraybuffer' });
    const parser = new OdtParser();
    await expect(parser.parse(buffer)).resolves.toBe('Hello Odt');
  });
});
