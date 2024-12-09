import {EmptyState, Card} from '@shopify/polaris';
import React from 'react';

export default function EmptyStateCom() {
  return (
    <Card sectioned>
      <EmptyState
        heading="Nothing found"
        // action={{content: 'Add transfer'}}
        // secondaryAction={{
          // content: 'Learn more',
          // url: 'https://help.shopify.com',
        // }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>Try changing filters or search query
</p>
      </EmptyState>
    </Card>
  );
}