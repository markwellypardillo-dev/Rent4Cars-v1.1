import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car as CarIcon, Plus, Edit2, Trash2, X, Search, Save, Loader2 } from 'lucide-react';
import { MessagingService, Car } from '../services/dataService';
import { useBackButton } from '../hooks/useBackButton';

interface AdminFleetManagerProps {
  onClose: () => void;
}

export default function AdminFleetManager({ onClose }: AdminFleetManagerProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [saving, setSaving] = useState(false);

  useBackButton(true, onClose);

  useEffect(() => {
    MessagingService.getFleet().then(data => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    car.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editingCar) {
        setCars(prev => prev.map(c => c.id === editingCar.id ? editingCar : c));
      }
      setSaving(false);
      setEditingCar(null);
    }, 800);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      setCars(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative z-10 flex flex-col h-[90vh] md:h-[85vh] overflow-hidden"
      >
        <div className="px-6 py-4 md:px-8 md:py-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex flex-shrink-0 items-center justify-center">
              <CarIcon size={20} className="text-primary md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">Fleet Manager</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove vehicles</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/50 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar - Car List */}
          <div className="w-full md:w-1/2 border-r border-gray-100 dark:border-gray-800/50 flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 space-y-4 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search fleet..."
                  className="w-full bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-white/50 dark:border-gray-700/50 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900/80 dark:bg-primary/80 backdrop-blur-md text-white rounded-xl font-bold shadow hover:opacity-90 transition-all text-sm border border-gray-800/50 dark:border-primary/50">
                <Plus size={16} /> Add New Vehicle
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>
              ) : (
                filteredCars.map(car => (
                  <div key={car.id} className="p-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-2xl flex gap-4 items-center group hover:border-primary transition-colors cursor-pointer" onClick={() => setEditingCar(car)}>
                    <img src={car.image} alt={car.name} className="w-20 h-14 object-cover rounded-lg bg-gray-100/50" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{car.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{car.type} • ₱{car.price}/day</p>
                    </div>
                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => { e.stopPropagation(); setEditingCar(car); }} className="p-2 bg-blue-50/50 dark:bg-blue-500/10 backdrop-blur-sm border border-white/50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Edit2 size={14}/></button>
                       <button onClick={(e) => { e.stopPropagation(); handleDelete(car.id); }} className="p-2 bg-red-50/50 dark:bg-red-500/10 backdrop-blur-sm border border-white/50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Editor */}
          <div className="w-full md:w-1/2 flex flex-col bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm overflow-y-auto custom-scrollbar">
            {editingCar ? (
               <div className="p-8 space-y-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit {editingCar.name}</h3>
                 
                 <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Vehicle Name</label>
                      <input type="text" value={editingCar.name} onChange={e => setEditingCar({...editingCar, name: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Price / Day (₱)</label>
                      <input type="number" value={editingCar.price} onChange={e => setEditingCar({...editingCar, price: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Image URL</label>
                      <input type="text" value={editingCar.image} onChange={e => setEditingCar({...editingCar, image: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Body Type</label>
                        <input type="text" value={editingCar.type} onChange={e => setEditingCar({...editingCar, type: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Powertrain</label>
                        <input type="text" value={editingCar.powertrain} onChange={e => setEditingCar({...editingCar, powertrain: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Features (Comma separated)</label>
                      <textarea rows={3} value={editingCar.features} onChange={e => setEditingCar({...editingCar, features: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea rows={4} value={editingCar.description} onChange={e => setEditingCar({...editingCar, description: e.target.value})} className="w-full p-3 rounded-xl border border-white/50 dark:border-gray-700/50 backdrop-blur-md bg-white/50 dark:bg-gray-800/30 text-gray-900 dark:text-white" />
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full py-4 mt-4 bg-primary/80 backdrop-blur-md text-white rounded-2xl font-bold border border-primary flex items-center justify-center gap-2 hover:bg-primary"
                    >
                      {saving ? <Loader2 className="animate-spin w-5 h-5"/> : <><Save size={18}/> Save Changes</>}
                    </button>
                 </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-gray-400 h-full min-h-[400px]">
                 <CarIcon size={64} className="opacity-20 mb-4" />
                 <p className="text-lg">Select a vehicle to edit</p>
                 <p className="text-sm mt-2 opacity-70 max-w-xs">Change pricing, add new features, or update descriptions easily.</p>
               </div>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
