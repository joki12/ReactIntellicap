import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Footer } from "@/components/Footer";

const Don = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    amount: "", 
    type: "financier", 
    description: "",
    technicalType: "",
    materialDetails: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset related fields when donation type changes
    if (name === "type") {
      if (value === "financier") {
        setForm({ ...form, type: value, technicalType: "", materialDetails: "" });
      } else if (value === "technique") {
        setForm({ ...form, type: value, amount: "", materialDetails: "" });
      } else if (value === "matériel") {
        setForm({ ...form, type: value, amount: "", technicalType: "" });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the form data based on donation type
    let submissionData = { ...form };
    
    if (form.type === "financier") {
      // For financial donations, ensure amount is provided
      if (!form.amount) {
        alert('Veuillez entrer un montant pour le don financier.');
        return;
      }
    } else if (form.type === "technique") {
      // For technical donations, ensure technical type is selected
      if (!form.technicalType) {
        alert('Veuillez sélectionner un type de don technique.');
        return;
      }
      // Update description to include technical type
      submissionData.description = `Don technique - ${form.technicalType}: ${form.description}`.trim();
    } else if (form.type === "matériel") {
      // For material donations, ensure material details are provided
      if (!form.materialDetails) {
        alert('Veuillez spécifier les détails du don matériel.');
        return;
      }
      // Update description to include material details
      submissionData.description = `Don matériel - ${form.materialDetails}: ${form.description}`.trim();
    }
    
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Erreur lors de l\'envoi du don. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Erreur lors de l\'envoi du don. Veuillez réessayer.');
    }
  };

  // Fetch RIB settings from database
  const { data: ribSetting } = useQuery({
    queryKey: ["/api/settings/rib_number"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/settings/rib_number");
      return response.json();
    }
  });

  const { data: bankNameSetting } = useQuery({
    queryKey: ["/api/settings/bank_name"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/settings/bank_name");
      return response.json();
    }
  });

  const ribNumber = ribSetting?.value || "481450800070519711864874";
  const bankName = bankNameSetting?.value || "foundation Intellcap";

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Faire un don</h1>
        <p className="text-lg text-gray-700 mb-8">Remplissez le formulaire pour faire un don. L'administrateur vous contactera.</p>
        
        {/* RIB Information */}
        <div className="bg-white p-6 rounded shadow w-full max-w-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Informations bancaires</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">RIB:</span>
              <span className="font-mono text-sm">{ribNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Banque:</span>
              <span>{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Devise:</span>
              <span>MAD (Dirham Marocain)</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Vous pouvez effectuer votre virement directement sur ce RIB
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-2xl font-semibold mb-2">Merci pour votre don !</h2>
            <p className="text-gray-700">Nous avons bien reçu vos informations. L'administrateur vous contactera bientôt.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="type">Type de don</label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="financier">Don Financier</option>
                <option value="technique">Don Technique</option>
                <option value="matériel">Don Matériel</option>
              </select>
            </div>

            {/* Conditional fields based on donation type */}
            {form.type === "financier" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="amount">Montant (MAD)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Entrez le montant en dirhams"
                />
              </div>
            )}

            {form.type === "technique" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="technicalType">Type de don technique</label>
                <select
                  id="technicalType"
                  name="technicalType"
                  value={form.technicalType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="mentorat">Mentorat</option>
                  <option value="formation">Formation</option>
                </select>
              </div>
            )}

            {form.type === "matériel" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="materialDetails">Détails du don matériel</label>
                <input
                  type="text"
                  id="materialDetails"
                  name="materialDetails"
                  value={form.materialDetails}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Ex: ordinateurs, serveurs, équipements..."
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="description">Description (optionnel)</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder={
                  form.type === "financier" 
                    ? "Décrivez votre don ou vos motivations..."
                    : form.type === "technique"
                    ? "Décrivez vos compétences ou votre disponibilité..."
                    : "Décrivez les équipements que vous souhaitez donner..."
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Don;
