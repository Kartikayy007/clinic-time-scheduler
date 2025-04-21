
import React, { useState } from "react";
import { UserRound, Stethoscope, Search, FileText, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DOCTORS = [
  { name: "Dr. Priya Sharma", specialty: "Cardiologist", experience: 13, rating: 4.8, details: "Harvard-trained, Fluent in Hindi/English.", avatar: "🩺" },
  { name: "Dr. John Singh", specialty: "Dermatologist", experience: 8, rating: 4.6, details: "Skilled in laser therapy.", avatar: "🧴" },
  { name: "Dr. Meera Patel", specialty: "General Physician", experience: 10, rating: 4.7, details: "Focus: preventive care.", avatar: "🏥" },
  { name: "Dr. Lisa Garcia", specialty: "Pediatrician", experience: 9, rating: 4.9, details: "Childcare specialist.", avatar: "👶" },
  { name: "Dr. Michael Chang", specialty: "Neurologist", experience: 11, rating: 4.5, details: "MS/Stroke expert.", avatar: "🧠" },
];

export default function DoctorList() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [bookStatus, setBookStatus] = useState<string | null>(null);

  const filtered = DOCTORS.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialty.toLowerCase().includes(query.toLowerCase())
  );

  const handleRequest = (i: number) => {
    setBookStatus("Request sent!");
    setTimeout(() => setBookStatus(null), 1300);
    setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 animate-fade-in bg-gradient-to-r from-[#E5DEFF]/80 via-[#D3E4FD]/80 to-[#FFDEE2]/70 p-3 rounded">
        <Search className="h-5 w-5 text-primary" />
        <input
          type="text"
          className="flex-1 px-2 py-1 rounded bg-white/40 text-sm focus:outline-primary transition-colors"
          placeholder="Search for doctor or specialty"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <ul className="space-y-3">
        {filtered.map((doc, i) => (
          <li
            key={doc.name}
            className={cn(
              "flex items-center bg-gradient-to-r from-[#E5DEFF]/80 to-[#D3E4FD]/60 rounded-lg border border-card p-4 shadow-sm transition-transform duration-150 hover:scale-105 animate-scale-in",
            )}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl mr-4 shadow">{doc.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-primary flex items-center gap-1">
                {doc.name} <Stethoscope className="ml-1 h-4 w-4 opacity-50" />
              </div>
              <div className="text-xs text-muted-foreground">{doc.specialty} • {doc.experience} yrs • ⭐ {doc.rating}</div>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-secondary text-secondary-foreground animate-fade-in mr-2"
              onClick={() => setSelected(i)}
            >
              <Info className="h-4 w-4 mr-1" /> Profile
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-gradient-to-r from-primary to-[#8B5CF6] text-white shadow animate-scale-in"
              onClick={() => { setSelected(i); }}
            >
              <Plus className="h-4 w-4 mr-1" /> Book
            </Button>
          </li>
        ))}
      </ul>
      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selected !== null ? DOCTORS[selected].name : ""}
            </DialogTitle>
          </DialogHeader>
          <div>
            {selected !== null && (
              <div className="py-2">
                <div className="text-lg font-medium mb-1">{DOCTORS[selected].specialty}</div>
                <div className="mb-1 text-gray-500 dark:text-gray-300">Experience: {DOCTORS[selected].experience} years</div>
                <div className="mb-2">About: {DOCTORS[selected].details}</div>
                <div className="mb-2">Rating: <span className="font-bold">{DOCTORS[selected].rating}</span>/5</div>
                <Button
                  className="bg-primary text-white w-full animate-scale-in"
                  onClick={() => handleRequest(selected)}
                >
                  Request Appointment
                </Button>
                {bookStatus && <div className="mt-3 text-green-600 text-xs animate-fade-in">{bookStatus}</div>}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
