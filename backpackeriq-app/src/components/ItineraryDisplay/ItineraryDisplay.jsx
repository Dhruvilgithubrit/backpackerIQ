import ReactMarkdown from 'react-markdown';
import './ItineraryDisplay.css';

function normalizeItineraryText(itineraryText) {
  const lines = String(itineraryText).split(/\r?\n/);
  const cleanedLines = [];
  let seenBudgetSection = false;
  let skippingBudgetDuplicate = false;

  // Matches any heading that signals a repeated budget/estimated-budget block
  const isBudgetHeading = (s) =>
    /^###\s*(Estimated Budget|Budget Summary|Budget Breakdown)\s*$/i.test(s);

  // Matches any top-level ### heading (used to end the skip zone)
  const isTopHeading = (s) => /^###\s+/.test(s);

  for (const line of lines) {
    const trimmed = line.trim();

    if (isBudgetHeading(trimmed)) {
      if (seenBudgetSection) {
        // This is a duplicate budget block — start skipping
        skippingBudgetDuplicate = true;
        continue;
      }
      seenBudgetSection = true;
    }

    if (skippingBudgetDuplicate) {
      // Stop skipping once we hit the next real top-level section
      if (isTopHeading(trimmed) && !isBudgetHeading(trimmed)) {
        skippingBudgetDuplicate = false;
      } else {
        continue; // drop every line inside the duplicate budget block
      }
    }

    cleanedLines.push(line);
  }

  return cleanedLines.join('\n');
}

export default function ItineraryDisplay({ itineraryText }) {
  if (!itineraryText) {
    return <div className="itin-raw"><pre>No itinerary data found.</pre></div>;
  }

  const normalizedItineraryText = normalizeItineraryText(itineraryText);

  return (
    <div className="itin-container">
      <div className="itin-markdown-wrap">
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => <h3 className="itin-h3" {...props} />,
            h4: ({node, ...props}) => <h4 className="itin-h4" {...props} />,
            ul: ({node, ...props}) => <ul className="itin-ul" {...props} />,
            li: ({node, ...props}) => <li className="itin-li" {...props} />,
            p:  ({node, ...props}) => {
              // Highlight Day X: titles if they accidentally get parsed as paragraphs
              if (typeof props.children === 'string' && props.children.match(/^(?:DAY|Day)\s+\d+:/)) {
                return <h4 className="itin-day-title">{props.children}</h4>;
              }
              return <p className="itin-p" {...props} />;
            },
            strong: ({node, ...props}) => <strong className="itin-strong" {...props} />
          }}
        >
          {normalizedItineraryText}
        </ReactMarkdown>
      </div>
    </div>
  );
}
