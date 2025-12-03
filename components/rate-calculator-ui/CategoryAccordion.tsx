"use client";

import { FC } from "react";
import {
  categoryTree,
  CategoryTreeNode,
  CategoryOptionNode,
  CategoryGroupNode,
} from "@/data/categoryTree";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type CategoryAccordionProps = {
  onSelectOption: (option: CategoryOptionNode) => void;
};

function isGroup(node: CategoryTreeNode): node is CategoryGroupNode {
  return node.type === "group";
}

function isOption(node: CategoryTreeNode): node is CategoryOptionNode {
  return node.type === "option";
}

export const CategoryAccordion: FC<CategoryAccordionProps> = ({
  onSelectOption,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {categoryTree.map((groupNode) => {
        if (!isGroup(groupNode)) return null;

        return (
          <AccordionItem key={groupNode.id} value={groupNode.id}>
            <AccordionTrigger className="text-left">
              <div className="flex flex-col">
                <span className="font-medium">{groupNode.label}</span>
                {groupNode.helperText && (
                  <span className="text-xs text-muted-foreground">
                    {groupNode.helperText}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {groupNode.children.map((child) => (
                  <CategoryNodeRow
                    key={child.id}
                    node={child}
                    onSelectOption={onSelectOption}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

type CategoryNodeRowProps = {
  node: CategoryTreeNode;
  onSelectOption: (option: CategoryOptionNode) => void;
};

const CategoryNodeRow: FC<CategoryNodeRowProps> = ({
  node,
  onSelectOption,
}) => {
  if (isOption(node)) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-medium text-sm">{node.label}</span>
          {node.helperText && (
            <span className="text-xs text-muted-foreground">
              {node.helperText}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelectOption(node)}
        >
          Select
        </Button>
      </div>
    );
  }

  // nested group
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{node.label}</span>
        {node.helperText && (
          <span className="text-xs text-muted-foreground">
            {node.helperText}
          </span>
        )}
      </div>
      <div className="space-y-2 border-l pl-3">
        {node.children.map((child) => (
          <CategoryNodeRow
            key={child.id}
            node={child}
            onSelectOption={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
};
