import React from "react";

// Sub-helper for inline styles like bold (**bold**)
function renderInlineMarkdown(text: string): React.ReactNode {
  const regex = /(\*\*.*?\*\*)/g;
  const splitParts = text.split(regex);
  return splitParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 800, color: "var(--text)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function RenderMarkdown({ text }: { text: string }): React.JSX.Element {
  if (!text) return <></>;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string | number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} style={{ marginLeft: 20, marginBottom: 12, listStyleType: "disc" }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: 4, lineHeight: 1.5 }}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: string | number) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      elements.push(
        <div key={`table-wrapper-${key}`} style={{ overflowX: "auto", marginBottom: 16, border: "1px solid var(--border)", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            {tableHeaders.length > 0 && (
              <thead>
                <tr style={{ background: "var(--bg2)", borderBottom: "1.5px solid var(--border)" }}>
                  {tableHeaders.map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800 }}>
                      {renderInlineMarkdown(h.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)", background: idx % 2 === 0 ? "transparent" : "rgba(0, 128, 128, 0.05)" }}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} style={{ padding: "10px 14px" }}>
                      {renderInlineMarkdown(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check for Table rows
    if (trimmed.startsWith("|")) {
      flushList(idx);
      const parts = trimmed.split("|").slice(1, -1);
      if (parts.every(p => p.trim().startsWith(":") || p.trim().startsWith("-") || p.trim() === "")) {
        return;
      }
      if (tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = parts;
      } else {
        tableRows.push(parts);
      }
      return;
    } else {
      flushTable(idx);
    }

    // Check for Headers
    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h5 key={idx} style={{ fontSize: 15, fontWeight: 800, marginTop: 16, marginBottom: 8, color: "var(--text)" }}>
          {renderInlineMarkdown(trimmed.substring(4))}
        </h5>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h4 key={idx} style={{ fontSize: 17, fontWeight: 900, marginTop: 20, marginBottom: 10, color: "var(--text)" }}>
          {renderInlineMarkdown(trimmed.substring(3))}
        </h4>
      );
    } else if (trimmed.startsWith("# ")) {
      flushList(idx);
      elements.push(
        <h3 key={idx} style={{ fontSize: 20, fontWeight: 900, marginTop: 24, marginBottom: 12, color: "var(--text)" }}>
          {renderInlineMarkdown(trimmed.substring(2))}
        </h3>
      );
    } else if (trimmed.startsWith("---")) {
      flushList(idx);
      elements.push(<hr key={idx} style={{ border: "none", borderTop: "1.5px solid var(--border)", margin: "16px 0" }} />);
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      listItems.push(trimmed.substring(2));
    } else {
      flushList(idx);
      if (trimmed === "") {
        elements.push(<div key={idx} style={{ height: 8 }} />);
      } else {
        elements.push(
          <p key={idx} style={{ marginBottom: 8, lineHeight: 1.6 }}>
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      }
    }
  });

  flushList("end");
  flushTable("end");

  return <div style={{ fontSize: "inherit", color: "inherit" }}>{elements}</div>;
}
