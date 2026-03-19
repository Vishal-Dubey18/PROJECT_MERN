import React, { useState, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import StatsBar from '../components/tasks/StatsBar';
import FilterBar from '../components/tasks/FilterBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import SkeletonGrid from '../components/common/SkeletonGrid';
import Pagination from '../components/common/Pagination';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('');
  const [sortBy,    setSortBy]    = useState('-createdAt');
  const [page,      setPage]      = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask,  setEditTask]  = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const handleSearch = useCallback((v) => { setSearch(v); setPage(1); }, []);
  const handleStatus = useCallback((v) => { setStatus(v); setPage(1); }, []);
  const handleSort   = useCallback((v) => { setSortBy(v); setPage(1); }, []);

  const { tasks, loading, error, pagination,
          createTask, updateTask, deleteTask, toggleStatus } = useTasks({
    search: debouncedSearch, status, sortBy, page, limit: 9,
  });

  const openCreate = useCallback(() => { setEditTask(null); setModalOpen(true); }, []);
  const openEdit   = useCallback((t)  => { setEditTask(t);  setModalOpen(true); }, []);
  const closeModal = useCallback(() => { setModalOpen(false); setEditTask(null); }, []);
  const handleSubmit = useCallback(
    (data) => editTask ? updateTask(editTask._id, data) : createTask(data),
    [editTask, createTask, updateTask]
  );

  const hour = new Date().getHours();
  const greeting = hour<12 ? 'Good morning' : hour<18 ? 'Good afternoon' : 'Good evening';
  const greetIcon = hour<12 ? '🌤' : hour<18 ? '☀️' : '🌙';

  return (
    <div style={{ minHeight:'100vh' }}>
      <Navbar onNewTask={openCreate} />

      <main style={{ maxWidth:1240, margin:'0 auto', padding:'36px 28px 80px' }}>

        {/* Greeting */}
        <div className="anim-fade-up" style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:30,fontWeight:800,letterSpacing:'-0.03em',lineHeight:1.2 }}>
            {greeting}, <span style={{
              background:'linear-gradient(135deg,#4f8ef7 0%,#a78bfa 60%,#7c3aed 100%)',
              backgroundSize:'200% auto',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
              animation:'gradientShift 4s ease infinite',
            }}>{user?.name?.split(' ')[0]}</span> {greetIcon}
          </h1>
          <p style={{ fontSize:15,color:'var(--text-secondary)',marginTop:8 }}>
            Here's what's on your plate today.
          </p>
        </div>

        {/* Stats */}
        <StatsBar tasks={tasks} />

        {/* Filters */}
        <FilterBar
          search={search}  onSearch={handleSearch}
          status={status}  onStatus={handleStatus}
          sortBy={sortBy}  onSort={handleSort}
        />

        {/* Task Grid */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="anim-scale-in" style={{
            display:'flex',flexDirection:'column',alignItems:'center',
            justifyContent:'center',padding:'64px 24px',gap:16,textAlign:'center',
          }}>
            <div style={{
              width:72,height:72,borderRadius:'20px',
              background:'rgba(239,68,68,0.08)',
              border:'1px solid rgba(239,68,68,0.2)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,
            }}>⚠️</div>
            <h3 style={{ fontSize:18,fontWeight:700,color:'#eef2ff' }}>Failed to load tasks</h3>
            <p style={{ fontSize:14,color:'var(--text-secondary)',maxWidth:320 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop:8,padding:'10px 24px',
                background:'rgba(79,142,247,0.1)',
                border:'1px solid rgba(79,142,247,0.25)',
                borderRadius:'10px',
                color:'var(--accent)',fontSize:14,fontWeight:600,fontFamily:'var(--font)',cursor:'pointer',
                transition:'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(79,142,247,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(79,142,247,0.1)'; }}
            >Retry</button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="anim-scale-in" style={{
            display:'flex',flexDirection:'column',alignItems:'center',
            justifyContent:'center',padding:'72px 24px',gap:16,textAlign:'center',
          }}>
            <div style={{
              width:80,height:80,borderRadius:'22px',
              background:'rgba(79,142,247,0.06)',
              border:'1px solid rgba(79,142,247,0.14)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,
              animation:'float 5s ease-in-out infinite',
            }}>📋</div>
            <h3 style={{ fontSize:20,fontWeight:700,color:'#eef2ff' }}>No tasks yet</h3>
            <p style={{ fontSize:14,color:'var(--text-secondary)',maxWidth:300 }}>
              Create your first task to get started. Stay organized, get things done.
            </p>
            <button
              onClick={openCreate}
              style={{
                marginTop:8,padding:'12px 28px',
                background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
                border:'none',borderRadius:'12px',
                color:'#fff',fontSize:15,fontWeight:700,fontFamily:'var(--font)',cursor:'pointer',
                boxShadow:'0 4px 24px rgba(79,142,247,0.35)',
                transition:'all var(--t-spring)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; }}
            >+ Create First Task</button>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16 }}>
            {tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                index={i}
                onEdit={openEdit}
                onDelete={deleteTask}
                onToggle={toggleStatus}
              />
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page || page}
          totalPages={pagination.totalPages || 1}
          onPageChange={setPage}
        />
      </main>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editTask={editTask}
      />
    </div>
  );
}
