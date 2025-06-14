from shutil import copyfile
import os

# Prepare destination for updated App.css with background image and overlay support
original_css_path = os.path.join(os.path.dirname(__file__), "client", "src", "App.css")
backup_css_path = os.path.join(os.path.dirname(__file__), "client", "src", "App_backup_before_modification.css")

# Backup original App.css before modifying
copyfile(original_css_path, backup_css_path)

# Load the current App.css content
with open(original_css_path, "r", encoding="utf-8") as f:
    original_css = f.read()

# Inject background image and overlay styles into .App
updated_css = original_css.replace(
    ".App {",
    """.App {
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
"""
)

# Add background overlay div class (if not already present)
if ".background-overlay" not in updated_css:
    updated_css += """

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 0;
}
"""

# Save the updated App.css
with open(original_css_path, "w", encoding="utf-8") as f:
    f.write(updated_css)

updated_css[:1500]  # Show preview
