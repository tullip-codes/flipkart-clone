interface SpecificationsTableProps {
  specs: Record<string, string>;
}

/**
 * SpecificationsTable — alternating-row table for product specs.
 * Accepts a plain key→value object (parsed from the JSON string stored in DB).
 */
export default function SpecificationsTable({ specs }: SpecificationsTableProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <table className="w-full text-sm">
      <tbody>
        {entries.map(([key, value], i) => (
          <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="py-2.5 px-4 font-medium text-gray-600 w-1/3 align-top">{key}</td>
            <td className="py-2.5 px-4 text-gray-800">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}