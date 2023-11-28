import { QuestionService } from "../../services/QuestionService";

describe('QuestionService', () => {
  describe('getImage', () => {
    it('should return empty string for text without image tag', () => {
      const text = 'This is a sample text without an image tag.';
      const imageUrl = QuestionService.getImage(text);
      expect(imageUrl).toBe('');
    });

    it('should return the image tag from the text', () => {
      const text = 'This is a sample text with an <img src="image.jpg" alt="Sample Image" /> tag.';
      const imageUrl = QuestionService.getImage(text);
      expect(imageUrl).toBe('<img src="image.jpg" alt="Sample Image" />');
    });
  });

  describe('getImageSource', () => {
    it('should return the image source from the image tag in the text', () => {
      const text = '<img src="image.jpg" alt="Sample Image" />';
      const imageUrl = QuestionService.getImageSource(text);
      expect(imageUrl).toBe('src="image.jpg" alt="Sample Image" /');
    });
  });

  describe('ignoreImgTags', () => {
    it('should return the same text if it does not contain an image tag', () => {
      const text = 'This is a sample text without an image tag.';
      const result = QuestionService.ignoreImgTags(text);
      expect(result).toBe(text);
    });

    it('should remove the image tag from the text', () => {
      const text = 'This is a sample text with an <img src="image.jpg" alt="Sample Image" /> tag.';
      const result = QuestionService.ignoreImgTags(text);
      expect(result).toBe('This is a sample text with an  tag.');
    });
  });
});
