# Instructions for Entity Generation

## Standalone Entity Generation
1. Create `0-aider.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-aider.md`
2. Create `1-MDM.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-1-MDM.md`
3. Create `2-SDT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-2-SDT.md`
4. Create `3-CTT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-3-CTT.md`
5. Ensure all referenced file paths in the templates exist by touching them

## Has-A Relationship Entity Generation
1. Create `0-aider.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-aider.md`
2. Create `1-MDM.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-HasA-1-MDM.md`
3. Create `2-SDT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-HasA-2-SDT.md`
4. Create `3-CTT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-HasA-3-CTT.md`
5. Ensure all referenced file paths in the templates exist by touching them

## Is-A Relationship Entity Generation
1. Create `0-aider.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-aider.md`
2. Create `1-MDM.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-IsA-1-MDM.md`
3. Create `2-SDT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-IsA-2-SDT.md`
4. Create `3-CTT.md` in `02-impl/ideas/genprompt/<EntityName>/` from `02-impl/ideas/genprompt-entity-IsA-3-CTT.md`
5. Ensure all referenced file paths in the templates exist by touching them

## File Structure
```
02-impl/ideas/
├── genprompt-aider.md                    # Base aider template
├── genprompt-entity-1-MDM.md            # Standalone entity MDM template
├── genprompt-entity-2-SDT.md            # Standalone entity SDT template
├── genprompt-entity-3-CTT.md            # Standalone entity CTT template
├── genprompt-entity-HasA-1-MDM.md       # Has-A relationship MDM template
├── genprompt-entity-HasA-2-SDT.md       # Has-A relationship SDT template
├── genprompt-entity-HasA-3-CTT.md       # Has-A relationship CTT template
├── genprompt-entity-IsA-1-MDM.md        # Is-A relationship MDM template
├── genprompt-entity-IsA-2-SDT.md        # Is-A relationship SDT template
├── genprompt-entity-IsA-3-CTT.md        # Is-A relationship CTT template
└── genprompt/
    └── <EntityName>/                     # Generated entity prompts
        ├── 0-aider.md
        ├── 1-MDM.md
        ├── 2-SDT.md
        └── 3-CTT.md
```

## Notes
- Each entity type (Standalone, Has-A, Is-A) uses the same aider template but different MDM, SDT, and CTT templates
- The aider template contains the common setup and command structure
- Templates should be copied and customized for the specific entity being generated
- All file paths referenced in templates should exist before running aider
- Follow proper naming conventions for all generated files