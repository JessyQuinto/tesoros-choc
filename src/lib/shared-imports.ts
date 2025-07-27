/**
 * Shared imports utility to reduce import boilerplate across components
 * Consolidates commonly used UI components and hooks
 */

// React essentials
export { useState, useEffect, useCallback, useMemo } from 'react';

// UI Components - Core
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export { Button } from '@/components/ui/button';
export { Input } from '@/components/ui/input';
export { Label } from '@/components/ui/label';
export { Badge } from '@/components/ui/badge';

// UI Components - Form
export { Textarea } from '@/components/ui/textarea';
export { Switch } from '@/components/ui/switch';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// UI Components - Layout
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Contexts and Hooks
export { useAuth } from '@/contexts/AuthContext';
export { useToast } from '@/hooks/use-toast';

// Layout Components
export { Header } from '@/components/Layout/Header';
export { Footer } from '@/components/Layout/Footer';

// Router
export { Link, useNavigate } from 'react-router-dom';

// Common Icons
export {
  Save,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
