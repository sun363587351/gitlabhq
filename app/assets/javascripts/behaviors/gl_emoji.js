import installCustomElements from 'document-register-element';
import { emojiImageTag, emojiFallbackImageSrc } from '../emoji';
import isEmojiUnicodeSupported from '../emoji/support';

installCustomElements(window);

export default function installGlEmojiElement() {
  const GlEmojiElementProto = Object.create(HTMLElement.prototype);
  GlEmojiElementProto.createdCallback = function createdCallback() {
    const emojiUnicode = this.textContent.trim();
    const {
      name,
      unicodeVersion,
      fallbackSrc,
      fallbackSpriteClass,
    } = this.dataset;

    const isEmojiUnicode = this.childNodes && Array.prototype.every.call(
      this.childNodes,
      childNode => childNode.nodeType === 3,
    );
    const hasImageFallback = fallbackSrc && fallbackSrc.length > 0;
    const hasCssSpriteFalback = fallbackSpriteClass && fallbackSpriteClass.length > 0;

    if (
      emojiUnicode &&
      isEmojiUnicode &&
      !isEmojiUnicodeSupported(emojiUnicode, unicodeVersion)
    ) {
      // CSS sprite fallback takes precedence over image fallback
      if (hasCssSpriteFalback) {
        // IE 11 doesn't like adding multiple at once :(
        this.classList.add('emoji-icon');
        this.classList.add(fallbackSpriteClass);
      } else if (hasImageFallback) {
        this.innerHTML = emojiImageTag(name, fallbackSrc);
      } else {
        const src = emojiFallbackImageSrc(name);
        this.innerHTML = emojiImageTag(name, src);
      }
    }
  };

  document.registerElement('gl-emoji', {
    prototype: GlEmojiElementProto,
  });
}
