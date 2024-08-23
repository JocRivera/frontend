import React from 'react';
import CabanaCard from './CabanaCard';

const CabanaList = ({ cabanas, onEdit, onRemove }) => {
  return (
    <div className="cabana-list">
      {cabanas.map((cabana) => (
        <CabanaCard
          key={cabana.id}
          cabana={cabana}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CabanaList;
