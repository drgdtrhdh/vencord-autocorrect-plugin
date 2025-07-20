// AutoCorrectMegaPlus.tsx
// Vencord plugin (written in TSX/React style)

import { useEffect } from "react";
import { before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";

const MessageEvents = findByProps("sendMessage");

const corrections: Record<string, string> = {
  // Sample only; include full list as needed
  "teh": "the",
  "pls": "please",
  "recieve": "receive",
  "adn": "and",
  "jsut": "just",
  "ur": "your",
  "u": "you",
  "dont": "don't",
  "wont": "won't",
  "cant": "can't"
  // ...extend to 500+ entries as needed
};

function autocorrectMessage(content: string): string {
  return content.replace(/\b\w+'\w+|\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    const fixed = corrections[lower];
    if (!fixed) return word;

    return word[0] === word[0].toUpperCase()
      ? fixed[0].toUpperCase() + fixed.slice(1)
      : fixed;
  });
}

export default function AutoCorrectPlugin() {
  useEffect(() => {
    const unpatch = before("sendMessage", MessageEvents, (args) => {
      const original = args[1].content;
      const corrected = autocorrectMessage(original);

      if (original !== corrected) {
        args[1].content = corrected;
        showToast("✅ Autocorrected", "success", 1000);
      }
    });

    return () => unpatch?.();
  }, []);

  return null;
}
