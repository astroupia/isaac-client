import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Brain, User, Clock } from "lucide-react";

interface AiChatMessageProps {
  message: {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
  };
}

// Helper function to format chat message text
const formatChatMessage = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Remove asterisks from headers
      .replace(/\*\*(.*?)\*\*/g, "$1")
      // Convert bullet points to proper format
      .replace(/^\s*•\s*/gm, "• ")
      .replace(/^\s*\*\s*/gm, "• ")
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, "\n\n")
      .trim()
  );
};

// Helper function to parse sections from chat message
const parseChatSections = (text: string) => {
  type SectionType = "header" | "list" | "paragraph";

  const sections: { title: string; content: string[]; type: SectionType }[] =
    [];
  const lines = text.split("\n");
  let currentSection: { title: string; content: string[]; type: SectionType } =
    {
      title: "",
      content: [],
      type: "paragraph",
    };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this is a section header (ends with colon and is followed by content)
    if (trimmedLine.endsWith(":") && trimmedLine.length < 100) {
      // Save previous section if it has content
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      // Start new section
      currentSection = {
        title: trimmedLine.slice(0, -1), // Remove the colon
        content: [],
        type: "header",
      };
    } else if (trimmedLine) {
      // Check if this is a numbered list item
      if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentSection.type !== "list") {
          // Save previous section if it has content
          if (currentSection.content.length > 0) {
            sections.push({ ...currentSection });
          }
          // Start new list section
          currentSection = {
            title: "",
            content: [],
            type: "list",
          };
        }
      }
      // Add content to current section
      currentSection.content.push(trimmedLine);
    }
  }

  // Add the last section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
};

export const AiChatMessage: React.FC<AiChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const formattedText = formatChatMessage(message.content);
  const sections = parseChatSections(formattedText);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-3">
              <p className="text-sm whitespace-pre-wrap">{formattedText}</p>
              <p className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-2xl">
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">
                AI Assistant
              </span>
              <Badge variant="outline" className="text-xs">
                AI
              </Badge>
            </div>

            <div className="space-y-4">
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    {section.title && (
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {section.title}
                      </h4>
                    )}

                    <div className="space-y-2">
                      {section.content.map((line, lineIndex) => {
                        // Check if this is a bullet point
                        if (line.startsWith("• ")) {
                          return (
                            <div
                              key={lineIndex}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-blue-500 mt-1 text-sm">
                                •
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {line.substring(2)}
                              </span>
                            </div>
                          );
                        }
                        // Check if this is a numbered list item
                        if (/^\d+\.\s/.test(line)) {
                          return (
                            <div
                              key={lineIndex}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-blue-500 mt-1 text-sm font-medium">
                                {line.match(/^\d+/)?.[0]}.
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {line.replace(/^\d+\.\s/, "")}
                              </span>
                            </div>
                          );
                        }
                        // Check if this is a bold text (was **text**)
                        if (line.includes("**")) {
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p
                              key={lineIndex}
                              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                              {parts.map((part, partIndex) => {
                                if (
                                  part.startsWith("**") &&
                                  part.endsWith("**")
                                ) {
                                  return (
                                    <strong
                                      key={partIndex}
                                      className="font-semibold"
                                    >
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        }
                        // Regular paragraph
                        return (
                          <p
                            key={lineIndex}
                            className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>

                    {index < sections.length - 1 && <Separator />}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {formattedText}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
