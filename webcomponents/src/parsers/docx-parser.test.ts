import { DocxParser } from './content-parser';
import JSZip from 'jszip';

describe('DocxParser', () => {
  it('extracts text from docx', async () => {
    const zip = new JSZip();
    zip.file(
      'word/document.xml',
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Hello Docx</w:t></w:r></w:p></w:body></w:document>'
    );
    const buffer = await zip.generateAsync({ type: 'arraybuffer' });
    const parser = new DocxParser();
    await expect(parser.parse(buffer)).resolves.toBe('Hello Docx');
  });
});
