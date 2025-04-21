
import React, { useState } from "react";
import { TestTube, FileText, Download, Info, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const RESULTS = [
  { id: 1, type: "Blood Test", value: 3.8, unit: "mmol/L", date: "2024-07-10", notes: "Normal", file: "BloodTestReport.pdf" },
  { id: 2, type: "X-Ray Chest", value: 1, unit: "", date: "2024-06-27", notes: "Needs Review", file: "XRayReport.pdf" },
  { id: 3, type: "Urine Test", value: 4.1, unit: "pH", date: "2024-06-10", notes: "Slightly Alkaline", file: "UrineTest.pdf" },
];

const chartData = RESULTS.map(r => ({
  name: r.type,
  value: Number(r.value) || 0,
}));

export default function PathologyList() {
  const [detailId, setDetailId] = useState<number | null>(null);

  const current = RESULTS.find(r => r.id === detailId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 animate-fade-in">
        <ChartBar className="h-6 w-6 text-primary" />
        <span className="font-semibold text-[17px] bg-gradient-to-r from-[#FEF7CD] to-[#FDE1D3] bg-clip-text text-transparent">Recent Results Trend</span>
      </div>
      <div className="rounded-lg bg-gradient-to-r from-[#FEF7CD] to-[#FDE1D3] shadow p-4 mb-7 animate-scale-in">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={8}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ul className="space-y-3">
        {RESULTS.map(result => (
          <li key={result.id} className="flex items-center border bg-gradient-to-r from-[#FEF7CD] to-[#FDE1D3] rounded-lg p-4 shadow-sm transition hover:scale-105 animate-scale-in">
            <TestTube className={cn("h-7 w-7 text-primary mr-3 animate-fade-in")} />
            <div className="flex-1">
              <div className="font-semibold">{result.type}</div>
              <div className="text-xs text-muted-foreground">{result.date} • {result.notes}</div>
              <div className="text-[13px] text-gray-700 dark:text-gray-200">
                Value: <span className="font-bold">{result.value}</span> {result.unit}
              </div>
            </div>
            <Button
              size="sm"
              className="mr-2 bg-secondary text-secondary-foreground animate-fade-in"
              onClick={() => setDetailId(result.id)}
            >
              <Info className="h-4 w-4 mr-1" /> Details
            </Button>
            <a
              href={`/${result.file}`}
              className="rounded py-2 px-3 text-[13px] bg-primary text-white shadow ml-1 animate-scale-in"
              download
            >
              <Download className="h-4 w-4 mr-1 inline" /> Download
            </a>
          </li>
        ))}
      </ul>
      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{current ? current.type : ""} - Detail</DialogTitle>
          </DialogHeader>
          {current && (
            <div className="space-y-3">
              <div><span className="font-medium">Date:</span> {current.date}</div>
              <div><span className="font-medium">Value:</span> {current.value} {current.unit}</div>
              <div><span className="font-medium">Notes:</span> {current.notes}</div>
              <a
                href={`/${current.file}`}
                className="inline-block rounded bg-primary text-white py-2 px-4 text-sm shadow animate-scale-in"
                download
              >
                <Download className="h-4 w-4 mr-1 inline" /> Download Report
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
